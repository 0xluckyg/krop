//PRIVATE SCOPE
/** Wrap everything so we're fully isolated from the global scope. */
(function(Host) {

    /// ========= CONFIGURATION ================================================

    var appUrl = "{{APP_URL}}"
    var domain = "{{DOMAIN}}"
    var path = "{{PATH}}"
    var appName = "{{APP_NAME}}"

    /// ========= GLOBAL VARIABLES =========================================
    
    var keys = {
        STAGE: 'stage',
        WIDGET: 'widget',
        STYLE: 'style',
        
        MOBILE_PROPERTY: 'mobile',
        DESKTOP_PROPERTY: 'desktop',
        TABLET_PROPERTY: 'tablet',
        
        SUBMIT_ACTION: 'submit',
        
        CONTAINER_ELEMENT: 'container_element',
        WRAPPER_ELEMENT: 'wrapper_element',
        BACKGROUND_ELEMENT: 'background_element',
        PAGE_ELEMENT: 'page_element',
        
        MULTIPLE_CHOICE_ELEMENT: 'multiple_choice_element', 
        CHECKBOX_ELEMENT: 'checkbox_element', 
        DROPDOWN_ELEMENT: 'dropdown_element', 
        SLIDER_ELEMENT: 'slider_element', 
        FORM_ELEMENT: 'form_element', 
        EMAIL_ELEMENT: 'email_element',
        PHONE_ELEMENT: 'phone_element', 
        ADDRESS_ELEMENT: 'address_element', 
        NAME_ELEMENT: 'name_element', 
        LONG_FORM_ELEMENT: 'long_form_element'
    }
    
    var currentSurveyOptions = null;
    var currentStageIndex = 0
    var currentPageIndex = 0
    var clientId = null;
    var sessionId = null;

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
    
    /// ========= SURVEY INITIATION ===============================================
    
    function requestSurveyOptions(callback) {
        var surveyOptionsUrl = appUrl + "/survey-options";
        // var domain = Host.domain || location.host;
        var device = detectMobile()
        JSONPostRequest(surveyOptionsUrl, {
            domain: domain,
            path: path,
            device: device,
        }, function(response) {
            callback(response);
        });
    }
    
    function gotSurveyOptions(surveyOptions) {
        clientId = surveyOptions.clientId
        sessionId = surveyOptions.sessionId
        currentSurveyOptions = surveyOptions;
        
        if(document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", function() {
                initiateStyle();
                initiateSurvey();
            });
        } else {
            initiateStyle();
            initiateSurvey();
        }
    }
    
    function stringIntoHTML(str) {
        var tempDiv = document.createElement('div')
        tempDiv.innerHTML = str
        return tempDiv.firstChild
    }
    
    function isSurveyElement(element) {
        if (!element) return false
        element = stringIntoHTML(element)
        var surveyElements = [
            keys.MULTIPLE_CHOICE_ELEMENT, keys.CHECKBOX_ELEMENT, keys.DROPDOWN_ELEMENT, keys.SLIDER_ELEMENT, keys.FORM_ELEMENT, keys.EMAIL_ELEMENT,
            keys.PHONE_ELEMENT, keys.ADDRESS_ELEMENT, keys.NAME_ELEMENT, keys.LONG_FORM_ELEMENT
        ]
        return surveyElements.includes(element.getAttribute("type"))
    }
    
    function elementsToPages(elements) {
        var pages = []
        if (!elements) return pages
        var pageCount = 0
        var firstElement = elements[0]
        var previousElement = firstElement
        pages[0] = [firstElement]
        
        for (var i = 1; i < elements.length; i++) {
            var element = elements[i]
            var surveyFlag = isSurveyElement(element)
            var previousFlag = isSurveyElement(previousElement)
            
            if (surveyFlag) {
                pageCount ++
                pages[pageCount] = [element]
            } else {
                if (previousFlag) pageCount ++
                if (!pages[pageCount]) pages[pageCount] = []
                pages[pageCount].push(element)
            }
            
            previousElement = element
        }
        
        return pages
    }
    
    // function findElementPageIndex(pages, element) {
    //     let pageIndex = 0
    //     for (let i = 0; i < pages.length; i++) {
    //         let page = pages[i]
    //         for (let j = 0; j < page.length; j++) {
    //             let pageEl = page[j]
    //             if (pageEl.id == element.id) {
    //                 return pageIndex
    //             }
    //         }
    //         pageIndex++
    //     }
    //     return pageIndex
    // }
    
    function getStage() {
        return currentSurveyOptions.stages[currentStageIndex]
    }
    
    function getPage() {
        var stageElements = getStage(currentStageIndex).elements
        return elementsToPages(stageElements)[currentPageIndex]
    }
    
    this.nextStage = function() {
        currentStageIndex += 1
        removePage()
        renderStage()
    }
    
    this.nextPage = function() {
        currentPageIndex += 1
        removePage()
        renderPage()
    }
    
    this.toStage = function(stageId) {
        
    }
    
    this.toPage = function(pageId) {
        
    }
    
    function createPage(elements) {
        var page = stringIntoHTML(currentSurveyOptions.page)
        for (var e = 0; e < elements.length; e ++) {
            var element = elements[e]
            var elementHTML = stringIntoHTML(element)
            page.appendChild(elementHTML)
        }
        return page
    }
    
    function removePage() {
        var page = document.getElementById(getId(keys.PAGE_ELEMENT))
        page.parentNode.removeChild(page);
    }
    
    function createButton(action) {
        var button = stringIntoHTML(currentSurveyOptions.button)
        button.firstChild.setAttribute('onclick', action)
        return button
    }
    
    function renderStage() {
        var stage = getStage()
        if (!stage.settings.questionPerPage) {
            var pageElements = getPage()
            renderPage(pageElements)   
        } else {
            var page = createPage(stage.elements)
            document.getElementById(getId(keys.BACKGROUND_ELEMENT)).appendChild(page)
            var button = createButton('nextStage()')
            document.getElementById(getId(keys.WRAPPER_ELEMENT)).appendChild(button)    
        }
    }
    
    function renderPage(elements) {
        var page = createPage(elements)
        document.getElementById(getId(keys.BACKGROUND_ELEMENT)).appendChild(page)
        var button = createButton('nextPage()')
        document.getElementById(getId(keys.WRAPPER_ELEMENT)).appendChild(button)
    }
    
    function initiateSurvey() {
        loadGoogleFont(currentSurveyOptions.font)
        var frame = currentSurveyOptions.frame
        document.getElementsByTagName("body")[0].innerHTML = frame
        renderStage()
    }
    
    function initiateStyle() {
        var stylesheet = document.createElement(keys.STYLE)
        stylesheet.id = getId(keys.STYLE)
        stylesheet.innerHTML = currentSurveyOptions.css
        document.getElementsByTagName("head")[0].appendChild(stylesheet);
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
    
    function getId(type, uid) {
        var id = type
        if (uid && uid != '') {
            uid = "_"+uid
        } else {
            uid = ''
        }
        return id+uid
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
    
    function getCookieId(type) {
        return appName+"__"+type
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
    
    function removeCookie(name) {   
        document.cookie = name+'=; Max-Age=-99999999;';  
    }

    

    requestSurveyOptions(gotSurveyOptions);
})(this);