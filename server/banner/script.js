//PRIVATE SCOPE
/** Wrap everything so we're fully isolated from the global scope. */
(function(Host) {

    /// ========= CONFIGURATION ================================================

    var ffWidgetBase = "{{APP_URL}}"
    var ffWidgetName = "{{APP_NAME}}"
    var accountId = "{{ACCOUNT_ID}}"
    var brandingEnabled = "{{BRANDING}}"
    var renderedWidgetCount = 0

    /// ========= GLOBAL VARIABLES =========================================
    
    var keys = {
        BACKGROUND: 'background',
        MAINBOARD: 'mainboard',
        BRANDING: 'branding',
        TAB: 'tab',
        ALERT: 'alert',
        
        STAGE: 'stage',
        WIDGET: 'widget',
        STYLE: 'style',
        
        MOBILE_PROPERTY: 'mobile',
        DESKTOP_PROPERTY: 'desktop',
        TABLET_PROPERTY: 'tablet',
        
        EXIT: 'exit',
        
        SUBMIT_ACTION: 'submit'
    }
    
    var currentWidgetOptions = null;
    var clientId = null;
    var sessionId = null;
    var inputsData = {}
    var branding = {}
    
    var deviceShow = true;
    var afterHide = true;
    var afterShow = true;
    var waitShow = true;
    var scrollShow = false;
    var exitIntentShow = false;

    /// ========= HELPERS ===============================================
    
    function JSONPostRequest(url, params, callback, errorCallback) {
        params = JSON.stringify(params)

        /// Form and send POST request.
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader(
            "Content-type", 
            "application/x-www-form-urlencoded"
        );
        xhr.onload = function() {
            try {
                if (xhr.status / 100 >= 4) {
                    return errorCallback(xhr.responseText)
                }
                return callback(JSON.parse(xhr.responseText));
            }
            catch(e) {
                errorCallback && errorCallback(e);
            }
        };
        xhr.onerror = function() {
            var err = new Error(
                "Received error response, status code " + xhr.status
            );
            errorCallback && errorCallback(err);
        };
        xhr.send(params);
    }

    function getId(type, widgetId, stageIndex, elementIndex) {
        var id = ffWidgetName+"__"+type
        if (widgetId || widgetId === 0) {
            id = id + "__b"+widgetId
        }
        if (stageIndex || stageIndex === 0) {
            id = id + "__s"+stageIndex
        }
        if (elementIndex || elementIndex === 0) {
            id = id + "__"+elementIndex
        }
        return id
    }
    
    /// ========= WIDGET INITIATION ===============================================
    
    function requestWidgetOptions(callback) {
        var widgetOptionsURL = ffWidgetBase + "/options";
        var domain = Host.domain || location.host;
        var device = detectMobile()
        JSONPostRequest(widgetOptionsURL, {
            domain: domain,
            device: device,
            branding: brandingEnabled,
            accountId: accountId
        }, function(response) {
            callback(response);
        });
    }
    
    function gotWidgetOptions(widgetOptions) {
        //setting up widget object
        var widget = {}
        var widgets = widgetOptions.widgets
        clientId = widgetOptions.clientId
        sessionId = widgetOptions.sessionId
        branding = widgetOptions.branding
        
        for (var i = 0; i < widgets.length; i++) {
            var setupId = widgets[i].widgetId
            widget[setupId] = widgets[i]
            widget[setupId].currentStageIndex = 0
            widget[setupId].previousStageIndex = 0
            widget[setupId].widgetClosed = true
            widget[setupId].exitAnimationCount = 0
        }
        
        currentWidgetOptions = widget;
        
        //initiation and rendering of widgets
        for (var i = 0; i < widgets.length; i++) {
            var initiateId = widgets[i].widgetId
            loadGoogleFonts(currentWidgetOptions[initiateId].fonts)
            
            /// When the DOM is ready, apply widgetOptions.
            if(document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", function() {
                    initiateStyle(initiateId);
                    initiateWidget(initiateId);
                });
            } else {
                initiateStyle(initiateId);
                initiateWidget(initiateId);
            }
        }
    }
    
    function initiateWidget(widgetId) {
        var widget = currentWidgetOptions[widgetId]
        var stages = widget.stages
        for (var i = 0; i < stages.length; i++) {
            evaluateScripts(stages[i])
        }
        
        saveVisit(widget)
        saveInfo()
        
        showOnDevice(widgetId)
        hideAfter(widgetId)
        showAfter(widgetId)
        wait(widgetId)
        showOnScroll(widgetId)
        showOnExitIntent(widgetId)
        
        testShouldShow(widgetId)
    }
    
    function evaluateScripts(html) {
        var evaluator = document.createElement('div');
        evaluator.innerHTML = html
        var scripts = evaluator.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; ++i) {
            var script = scripts[i];
            eval('eval')(script.innerHTML);
        }
    }
    
    function initiateStyle(widgetId) {
        var widget = currentWidgetOptions[widgetId]
        var css = widget.css
        if (brandingEnabled) {
             css += branding.css
        }
        var stylesheet = document.createElement(keys.STYLE)
        stylesheet.id = getId(keys.STYLE)
        stylesheet.innerHTML = css
        document.getElementsByTagName("head")[0].appendChild(stylesheet);
    }
    
    function loadGoogleFonts(fonts) {
        for (var i = 0; i < fonts.length; i++) {
            loadGoogleFont(fonts[i])
        }
    }
    
    function loadGoogleFont(name) {
        /// Convert spaces in font name to '+'s.
        name = name.replace(/\s+/, "+");

        var link = document.createElement("link")
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "https://fonts.googleapis.com/css?family=" + name;
        document.head.appendChild(link);
    }
    
    requestWidgetOptions(gotWidgetOptions);
    
    /// ========= BRANDING ================================================
    
    function insertBranding() {
        var container = document.getElementsByTagName('html')[0]
        if (renderedWidgetCount > 0) return
        var wrapper = document.createElement('div')
        if (!branding.html) return
        wrapper.innerHTML = branding.html
        container.appendChild(wrapper.firstChild)
        
        return container
    }
    
    function removeBranding() {
        if (renderedWidgetCount > 0) return
        var brandingId = getId(keys.BRANDING)   
        var brandingElement = document.getElementById(brandingId)
        if (!brandingElement) return
        brandingElement.remove()
    }
    
    /// ========= WIDGET CREATE AND SHOW ================================================
    
    function showStage(widgetId, stageIndex) {
        var newStage = document.createElement('div')
        newStage.innerHTML = currentWidgetOptions[widgetId].stages[stageIndex]
        document.getElementsByClassName(getId(keys.BACKGROUND, widgetId))[0].appendChild(newStage.firstChild)
    }
    
    function createTab(widgetId, element) {
        if (document.getElementsByClassName(getId(keys.TAB, widgetId))[0]) return
        var tab = currentWidgetOptions[widgetId].tab
        if (!tab) return
        var wrapper = document.createElement('div')
        wrapper.innerHTML = tab
        element.appendChild(wrapper.firstChild)
    }
    
    function createWidget(widgetId, container) {
        var current = currentWidgetOptions[widgetId]
        var background = current.background
        if (!container) {
            container = document.createElement('div')
            container.id = getId(keys.WIDGET, widgetId)   
            container.style.zIndex = 999999 + Number(current.behaviors.importance)
            var exited = 0
            container.addEventListener('animationend', function(e) {
                if (!e.animationName.includes(keys.EXIT) || e.animationName.includes(keys.ALERT)) return
                if (exited < current.exitAnimationCount) {
                    exited++
                }
                if (exited != current.exitAnimationCount) {
                    return
                }
                removeElement(widgetId)
                exited = 0;
            });
        }
        var wrapper= document.createElement('div');
        var stage = current.stages[current.currentStageIndex]
        if (background) {
            wrapper.innerHTML = background
            wrapper = wrapper.firstChild
            wrapper.innerHTML = stage
        } else {
            wrapper.innerHTML = stage
            wrapper = wrapper.firstChild
            wrapper.id = getId(keys.BACKGROUND, widgetId)
        }
        container.appendChild(wrapper)
        createTab(widgetId, container)
        return container
    }
    
    /// ========= WIDGET HIDE AND REMOVE ================================================
    
    function removeElement(widgetId) {
        var widgetClosed = currentWidgetOptions[widgetId].widgetClosed
        var element = document.getElementsByClassName(getId(keys.BACKGROUND, widgetId))[0]
        if (widgetClosed && element) {
            element.parentNode.removeChild(element);
        } else {
            var previousStageIndex = currentWidgetOptions[widgetId].previousStageIndex
            var stage = document.getElementsByClassName(getId(keys.STAGE, widgetId, previousStageIndex))[0]
            stage.parentNode.removeChild(stage)
        }
        currentWidgetOptions[widgetId].exitAnimationCount = 0;
    }
    
    function removeStage(widgetId, stageIndex) {
        var stage = document.getElementsByClassName(getId(keys.STAGE, widgetId, stageIndex))[0]
        
        exitAnimation(widgetId, stage);
        if (currentWidgetOptions[widgetId].exitAnimationCount == 0) {
            removeElement(widgetId)
        }
    }
    
    function exitAnimation(widgetId, node){
        if (!node) return
        
        if (node.getAttribute(keys.EXIT)) {
            node.id = node.className + '__' + keys.EXIT;
            currentWidgetOptions[widgetId].exitAnimationCount += Number(node.getAttribute(keys.EXIT))
        } 
        
        var nodes = node.children;
        for (var i = 0; i <nodes.length; i++){
            var child = nodes[i]
            if(!child || !child.className){
                continue;
            }
            exitAnimation(widgetId, child);
        }
    }
    
    /// ========= WIDGET ACTIONS ================================================

    this.showWidget = function(widgetId) {
        var widget = currentWidgetOptions[widgetId]
        if (!widget.widgetClosed) return
        
        var exitAnimationCount = widget.exitAnimationCount
        if (exitAnimationCount != 0) {
            removeElement()
        }
        
        var client = document.getElementsByTagName('html')[0]
        var containerId = getId(keys.WIDGET, widgetId)
        var container = document.getElementById(containerId)
        if (!container) {
            insertBranding()
            var widgetHtml = createWidget(widgetId, container)
            client.insertAdjacentElement("afterbegin", widgetHtml);
        } else {
            insertBranding()
            createWidget(widgetId, container)
        }
        
        currentWidgetOptions[widgetId].widgetClosed = false
        saveView(widget)
        
        renderedWidgetCount += 1
    }

    this.closeWidget = function(widgetId) {
        currentWidgetOptions[widgetId].widgetClosed = true
        var element = document.getElementsByClassName(getId(keys.BACKGROUND, widgetId))[0]
        exitAnimation(widgetId, element)
        if (currentWidgetOptions[widgetId].exitAnimationCount == 0) {
            removeElement(widgetId)
        }
        
        renderedWidgetCount -= 1
        
        removeBranding()
    }
    
    this.toggleWidget = function(widgetId) {
        var widgetClosed = currentWidgetOptions[widgetId].widgetClosed
        if (widgetClosed) {
            this.showWidget(widgetId)
            currentWidgetOptions[widgetId].widgetClosed = false
        } else {
            this.closeWidget(widgetId)
            currentWidgetOptions[widgetId].widgetClosed = true
        }
    }
    
    this.nextStage = function(widgetId, calledFrom) {
        validateInputs(widgetId, function(widgetId, response) {
            var nextStageIndex = currentWidgetOptions[widgetId].currentStageIndex + 1
            var nextStage = currentWidgetOptions[widgetId].stages[nextStageIndex]
            
            if (calledFrom != keys.SUBMIT_ACTION) {
                saveInputsLocally(widgetId)   
            }
            
            if (!nextStage) {
                return this.closeWidget(widgetId)
            }
            
            removeStage(widgetId, nextStageIndex-1)
            showStage(widgetId, nextStageIndex)
            
            currentWidgetOptions[widgetId].previousStageIndex = currentWidgetOptions[widgetId].currentStageIndex
            currentWidgetOptions[widgetId].currentStageIndex += 1
        }, calledFrom != keys.SUBMIT_ACTION)
    }
    
    this.previousStage = function(widgetId) {
        currentWidgetOptions[widgetId].previousStageIndex = currentWidgetOptions[widgetId].currentStageIndex
        currentWidgetOptions[widgetId].currentStageIndex -= 1
        
        var currentStageIndex = currentWidgetOptions[widgetId].currentStageIndex
        var previousStage = currentWidgetOptions[widgetId].stages[currentStageIndex]
        if (previousStage) {
            removeStage(widgetId, currentStageIndex+1)
            showStage(widgetId, currentStageIndex)
        } else {
            this.closeWidget(widgetId)
        }
    }
    
    this.toStage = function(widgetId, stageIndex) {
        var currentStageIndex = currentWidgetOptions[widgetId].currentStageIndex
        currentWidgetOptions[widgetId].previousStageIndex = currentStageIndex
        if (stageIndex || stageIndex == 0) {
            currentWidgetOptions[widgetId].currentStageIndex = stageIndex
            removeStage(widgetId, currentStageIndex)
            showStage(widgetId, stageIndex)
        }
    }
    
    /// ========= BEHAVIOR ================================================
    
    function showOnDevice(widgetId) {
        if (!currentWidgetOptions || !currentWidgetOptions[widgetId]) return
        
        //mobile, desktop
        var device = detectMobile()
        var deviceOption = currentWidgetOptions[widgetId].behaviors.device
        if (deviceOption != 'both' && deviceOption != device) {
            deviceShow = false
        }
    }
    
    function hideAfter(widgetId) {
        if (!currentWidgetOptions || !currentWidgetOptions[widgetId]) return
        var hideAfter = currentWidgetOptions[widgetId].behaviors.hideAfter
        if (hideAfter.type == 'none') return
        
        var widgetUid = currentWidgetOptions[widgetId].widgetUid
        var cookieId = getCookieId(keys.WIDGET, widgetUid)
        var widgetCookie = getCookie(cookieId)
        if (!widgetCookie) return
        widgetCookie = JSON.parse(widgetCookie)
        
        if (hideAfter.type == 'duration') {
            var cookieDate = new Date(widgetCookie.date)
            cookieDate.setSeconds(cookieDate.getSeconds() + durationToSeconds(hideAfter.duration))  
            if (new Date() > cookieDate) {
                afterHide = false
                testShouldShow(widgetId)
            }
        } else if (hideAfter.type == 'visits') {
            if (widgetCookie.visits > hideAfter.visits) {
                afterHide = false
                testShouldShow(widgetId)
            }
        } else if (hideAfter.type == 'views') {
            if (widgetCookie.views > hideAfter.views) {
                afterHide = false
                testShouldShow(widgetId)
            }   
        }
    }
    
    function showAfter(widgetId) {
        if (!currentWidgetOptions || !currentWidgetOptions[widgetId]) return
        var showAfter = currentWidgetOptions[widgetId].behaviors.showAfter
        if (showAfter.type == 'instant') return
        
        var widgetUid = currentWidgetOptions[widgetId].widgetUid
        var cookieId = getCookieId(keys.WIDGET, widgetUid)
        var widgetCookie = getCookie(cookieId)
        if (!widgetCookie) return
        widgetCookie = JSON.parse(widgetCookie)
        
        afterShow = false
        if (showAfter.type == 'duration') {
            var cookieDate = new Date(widgetCookie.date)
            cookieDate.setSeconds(cookieDate.getSeconds() + durationToSeconds(showAfter.duration))  
            if (new Date() > cookieDate) {
                afterShow = true
                testShouldShow(widgetId)
            }
        } else if (showAfter.type == 'visits') {
            if (widgetCookie.visits > showAfter.visits) {
                afterShow = true
                testShouldShow(widgetId)
            }   
        }
    }
    
    function wait(widgetId) {
        if (!currentWidgetOptions || !currentWidgetOptions[widgetId]) return
        
        var wait = currentWidgetOptions[widgetId].behaviors.wait
        if (wait <= 0) return
        
        waitShow = false
        setTimeout(function() {
            waitShow = true
            testShouldShow(widgetId)
        }, wait * 1000)
    }
    
    function showOnScroll(widgetId) {
        if (!currentWidgetOptions || !currentWidgetOptions[widgetId]) return
        
        var scroll = currentWidgetOptions[widgetId].behaviors.onScroll
        if (!scroll.enabled) {
            scrollShow = true
            testShouldShow(widgetId)
        }
        detectScroll(scroll, widgetId)
        window.addEventListener("scroll", function(e) {
            detectScroll(scroll, widgetId)
        });   
    }
    
    function showOnExitIntent(widgetId) {
        if (!currentWidgetOptions || !currentWidgetOptions[widgetId]) return
        
        var exitIntent = currentWidgetOptions[widgetId].behaviors.onExit
        if (!exitIntent) return
        document.addEventListener("mouseout", function(evt) {
            if(evt.toElement === null && evt.relatedTarget === null) {
                exitIntentShow = true
                testShouldShow(widgetId)
            }
        }.bind(this));
    }
    
    function testShouldShow(widgetId) {
        console.log("===SHOW LOG===")
        console.log("deviceShow", deviceShow)
        console.log("afterHide", afterHide)
        console.log("afterShow", afterShow)
        console.log("waitShow", waitShow)
        console.log("scrollShow", scrollShow)
        if (!afterHide) return
        
        if (deviceShow && afterShow && exitIntentShow) {
            this.showWidget(widgetId)
            return
        }
        
        if (deviceShow && afterShow && waitShow && scrollShow) {
            this.showWidget(widgetId)
        }
    }
    
    
    /// ========= BEHAVIOR HELPER FUNCTIONS ================================================
    
    // https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
    function detectMobile() {
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            return keys.MOBILE_PROPERTY
        } else if (window.innerWidth < 481) {
            return keys.MOBILE_PROPERTY
        } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
            return keys.TABLET_PROPERTY
        } else {
            return keys.DESKTOP_PROPERTY
        }
    }
    
    function detectBrowser() { 
        var browser = null
        if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
            browser = 'Opera'
        } else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
            browser = 'Chrome'
        } else if(navigator.userAgent.indexOf("Safari") != -1) {
            browser = 'Safari'
        } else if(navigator.userAgent.indexOf("Firefox") != -1 ) {
            browser = 'Firefox'
        } else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {//IF IE > 10 
            browser = 'IE'
        } else {
            browser = null
        }
        return browser
    }
    
    function durationToSeconds(duration) {
        var daysSeconds = duration.d * 24 * 60 * 60
        var hoursSeconds = duration.h * 60 * 60
        var minutesSeconds = duration.m * 60
        return daysSeconds + hoursSeconds + minutesSeconds + duration.s
    }
    
    function detectScroll(scroll, widgetId) {
        var scrollPercent = getScrollPercent()
        if (scrollPercent >= scroll.percent) {
            scrollShow = true
            testShouldShow(widgetId)
        }
    }
    
    function getScrollPercent() {
        var h = document.documentElement, 
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
        return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
    }
    
    function saveVisit(widget) {
        var widgetUid = widget.widgetUid
        var cookieId = getCookieId(keys.WIDGET, widgetUid)
        var widgetCookie = getCookie(cookieId)
        
        if (!widgetCookie) {
            var newCookie = {
                type: showAfter.type,
                widgetUid: widget.widgetUid,
                date: new Date(),
                visits: 1,
                views: 0
            }
            setCookie(cookieId, JSON.stringify(newCookie), 365)
        } else {
            widgetCookie = JSON.parse(widgetCookie)
            widgetCookie.visits = widgetCookie.visits + 1
            setCookie(cookieId, JSON.stringify(widgetCookie), 365)
        }
    }
    
    function saveInfo() {
        var cookieId = getCookieId('info')
        var infoCookie = getCookie(cookieId)
        
        if (!infoCookie) {
            var newCookie = {
                sessionId: sessionId,
                clientId: clientId,
                date: new Date(),
                lastVisit: new Date(),
                visits: 1,
            }
            setCookie(cookieId, JSON.stringify(newCookie), 3650)
        } else {
            infoCookie = JSON.parse(infoCookie)
            infoCookie.visits = infoCookie.visits + 1
            infoCookie.sessionId = sessionId
            infoCookie.lastVisit = new Date()
            setCookie(cookieId, JSON.stringify(infoCookie), 365)
            if (infoCookie.clientId) {
                clientId = infoCookie.clientId
            }
        }
    }
    
    function saveView(widget) {
        var widgetUid = widget.widgetUid
        var cookieId = getCookieId(keys.WIDGET, widgetUid)
        var widgetCookie = getCookie(cookieId)
        
        if (!widgetCookie) {
            var newCookie = {
                type: showAfter.type,
                widgetUid: widget.widgetUid,
                date: new Date(),
                visits: 1,
                views: 1
            }
            setCookie(cookieId, JSON.stringify(newCookie), 365)
        } else {
            widgetCookie = JSON.parse(widgetCookie)
            widgetCookie.views = widgetCookie.views + 1
            setCookie(cookieId, JSON.stringify(widgetCookie), 365)
        }
    }
    
    function getCookieId(type, widgetId) {
        if (widgetId) {
            return ffWidgetName+"__"+type+"__"+widgetId   
        } else {
            return ffWidgetName+"__"+type
        }
    }
    
    function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    
    function eraseCookie(name) {   
        document.cookie = name+'=; Max-Age=-99999999;';  
    }

    /// ========= FORM SUBMISSION ================================================
    
    var alertTimeout = null
    function hideAlert(widgetId) {
        var containerId = getId(keys.WIDGET, widgetId)
        var container = document.getElementById(containerId)
        var alertId = getId(keys.ALERT, widgetId)
        var alertElement = document.getElementsByClassName(alertId)[0]
        clearTimeout(alertTimeout)
        alertTimeout = setTimeout(function() {
            if (alertElement.getAttribute(keys.EXIT)) {
                alertElement.id = alertElement.className+ '__' + keys.EXIT;
                container.addEventListener('animationend', function(e) {
                    if (!e.animationName.includes(keys.ALERT) || !e.animationName.includes(keys.EXIT)) return
                    if (alertElement.parentNode) alertElement.parentNode.removeChild(alertElement);
                });   
            } else {
                if (alertElement.parentNode) alertElement.parentNode.removeChild(alertElement);   
            }
        }, Number(alertElement.getAttribute('duration')) * 1000)
    }
    
    function showAlert(widgetId, message) {
        var containerId = getId(keys.WIDGET, widgetId)
        var container = document.getElementById(containerId)
        var alertWidget = currentWidgetOptions[widgetId].alert
        if (!alertWidget) return
        var wrapper = document.createElement('div')
        wrapper.innerHTML = alertWidget
        wrapper.firstChild.innerHTML = message
        container.appendChild(wrapper.firstChild)
    }
    
    function handleAlert(widgetId, message) {
        var alertId = getId(keys.ALERT, widgetId)
        if (document.getElementsByClassName(alertId)[0]) {
            var alertElement = document.getElementsByClassName(alertId)[0]
            alertElement.innerHTML = message
            hideAlert(widgetId)
            return
        }
        
        showAlert(widgetId, message)
        hideAlert(widgetId)
    }
    
    function validateInputs(widgetId, callback, serverValidation) {
        var inputs = getCurrentInputs(widgetId)
        var mustValidate = false
        var validateInputs = {}
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i]
            if (!input.value || input.value == '') {
                return handleAlert(widgetId, "Your form can't be blank!")
            }
            
            if (input.type == 'email') {
                validateInputs.email = inputs[i]
                mustValidate = true
            }
            if (input.type == keys.MOBILE_PROPERTY) {
                validateInputs.mobile = inputs[i]
                mustValidate = true
            }
        }
        
        if (!mustValidate || !serverValidation) {
            return callback(widgetId, true)
        }
        
        JSONPostRequest(ffWidgetBase+"/widget-validate", {
            inputs: validateInputs
        }, function(response) {
            callback(widgetId, response)
        }, function(error) {
            handleAlert(widgetId, error)
        });
    }
    
    function getCurrentInputs(widgetId) {
        var containerId = getId(keys.WIDGET, widgetId)
        var inputs = document.getElementById(containerId).getElementsByTagName('input')
        console.log("IN; ", inputs)
        var inputValues = []
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i]
            var inputData = {}
            inputData.value = input.value
            inputData.class = input.getAttribute('class')
            if (input.getAttribute("tags") && input.getAttribute("tags") != "") {
                inputData.tags = input.getAttribute("tags").split(',') 
            } else {
                inputData.tags = []
            }
            inputData.type = input.getAttribute("type")
            
            inputValues.push(inputData)
        }
        return inputValues
    }
    
    function saveInputsLocally(widgetId) {
        if (!inputsData[widgetId]) {
            inputsData[widgetId] = []    
        }
        
        var inputs = getCurrentInputs(widgetId)
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i]

            var exists = false
            for (var j = 0; j < inputsData[widgetId].length; j++) {
                if (inputsData[widgetId][j].class == input.class) {
                    exists = true
                }
            }
            
            if (!exists) {
                inputsData[widgetId].push(input)
            }
        }
    }

    this.submitForm = function(widgetId, callback) {
        validateInputs(widgetId, function(widgetId, response) {
            saveInputsLocally(widgetId)
            JSONPostRequest(ffWidgetBase+"/widget-response", {
                sessionId: sessionId,
                clientId: clientId,
                campaignId: currentWidgetOptions[widgetId].widgetUid,
                
                device: detectMobile(),
                browser: detectBrowser(),
                path: window.location.href,
                
                inputs: inputsData[widgetId]
            }, function(response) {
                inputsData[widgetId] = []
                callback(widgetId, keys.SUBMIT_ACTION)
            }, function(error) {
                inputsData[widgetId] = []
                handleAlert(widgetId, error)
            });
        }, false) //set server validation to false since submit is going to validate in the server side anyway
    }

})(this);