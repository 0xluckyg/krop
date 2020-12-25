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
        
        QUESTION_ELEMENT: 'question',
        CONTAINER_ELEMENT: 'container',
        WRAPPER_ELEMENT: 'wrapper',
        BACKGROUND_ELEMENT: 'background',
        PAGE_ELEMENT: 'page',
        BUTTON_ELEMENT: 'button',
        
        MULTIPLE_CHOICE_ELEMENT: 'multiple_choice', 
        CHECKBOX_ELEMENT: 'checkbox', 
        DROPDOWN_ELEMENT: 'dropdown', 
        SLIDER_ELEMENT: 'slider', 
        FORM_ELEMENT: 'form', 
        EMAIL_ELEMENT: 'email',
        PHONE_ELEMENT: 'phone', 
        ADDRESS_ELEMENT: 'address', 
        NAME_ELEMENT: 'name', 
        LONG_FORM_ELEMENT: 'long_form'
    }
    
    var currentSurveyOptions = null;
    var currentStageIndex = 0
    var currentPageIndex = 0
    var alertActivated = false
    var surveyName = null;
    var clientId = null;
    var sessionId = null;
    var surveyId = null;
    var accountId = null;

    /// ========= SURVEY HELPERS ===============================================
    
    function isSurveyElement(element) {
        if (!element) return false
        if (typeof element == 'string') {
            element = stringIntoHTML(element)   
        }
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
    
    function getStage() {
        return currentSurveyOptions.stages[currentStageIndex]
    }
    
    function getPage() {
        var stageElements = getStage(currentStageIndex).elements
        return elementsToPages(stageElements)[currentPageIndex]
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
        surveyId = surveyOptions.surveyId
        surveyName = surveyOptions.surveyName
        accountId = surveyOptions.accountId
        currentSurveyOptions = surveyOptions;
        
        if(document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", function() {
                initiateSurvey()
            });
        } else {
            initiateSurvey()
        }
    }
    
    function initiateSurvey() {
        initiateHTML()
        initiateCSS()
        initiateJS()
    }
    
    function initiateHTML() {
        loadGoogleFont(currentSurveyOptions.font)
        var frame = currentSurveyOptions.frame
        document.getElementsByTagName("body")[0].innerHTML = frame
        renderStage()
    }
    
    function initiateCSS() {
        var stylesheet = document.createElement(keys.STYLE)
        stylesheet.id = getId(keys.STYLE)
        stylesheet.innerHTML = currentSurveyOptions.css
        document.getElementsByTagName("head")[0].appendChild(stylesheet);
    }
    
    function initiateJS() {
        // console.log("CU: ", currentSurveyOptions.js)
        eval('eval')(currentSurveyOptions.js);
    }
    
    requestSurveyOptions(gotSurveyOptions);
    
    /// ========= SURVEY FUNCTIONS ===============================================
    
    function createPage(elements) {
        var page = stringIntoHTML(currentSurveyOptions.page)
        for (var e = 0; e < elements.length; e ++) {
            var element = elements[e]
            var elementHTML = stringIntoHTML(element)
            page.appendChild(elementHTML)
        }
        return page
    }
    
    function createButton(action) {
        var stage = getStage()
        var isLastStage = (currentStageIndex >= currentSurveyOptions.stages.length - 1)
        if (stage.settings.questionPerPage) {
            var pagesLength = elementsToPages(stage.elements).length
            if (isLastStage && currentPageIndex >= pagesLength - 1) return null
        } else {
            if (isLastStage) return null
        }
        
        var button = stringIntoHTML(currentSurveyOptions.button)
        button.firstChild.setAttribute('onclick', action)
        return button
    }
    
    function renderStage() {
        var stage = getStage()
        if (stage.settings.questionPerPage) {
            var pageElements = getPage()
            renderPage(pageElements)   
        } else {
            var page = createPage(stage.elements)
            document.getElementById(getId(keys.BACKGROUND_ELEMENT)).appendChild(page)
            var button = createButton('nextStage()')
            if (button) document.getElementById(getId(keys.PAGE_ELEMENT)).appendChild(button)    
        }
    }
    
    function renderPage(elements) {
        var page = createPage(elements)
        document.getElementById(getId(keys.BACKGROUND_ELEMENT)).appendChild(page)
        var button = createButton('nextPage()')
        document.getElementById(getId(keys.PAGE_ELEMENT)).appendChild(button)
    }
    
    function removePage() {
        var page = document.getElementById(getId(keys.PAGE_ELEMENT))
        var button = document.getElementById(getId(keys.BUTTON_ELEMENT))
        page.parentNode.removeChild(page);
        button.parentNode.removeChild(button)
    }
    
    this.nextStage = function() {
        submit(function() {
            currentStageIndex += 1
            removePage()
            renderStage()  
        })
    }
    
    this.nextPage = function() {
        submit(function() {
            var stageElements = getStage(currentStageIndex).elements
            var pages = elementsToPages(stageElements)
            
            if (currentPageIndex < pages.length-1) {
                currentPageIndex += 1
                removePage()
    
                var pageElements = pages[currentPageIndex]
                renderPage(pageElements)      
            } else {
                currentStageIndex += 1
                currentPageIndex = 0
                removePage()
                
                var nextStageElements = getStage(currentStageIndex).elements
                var nextPageElements = elementsToPages(nextStageElements)[currentPageIndex]
                renderPage(nextPageElements)
            }  
        })
    }
    
    this.toStage = function(stageId) {
        
    }
    
    this.toPage = function(pageId) {
        
    }
    
    /// ========= SURVEY RESPONSE ================================================
    
    function submit(callback) {
        resetAlertText()
        alertActivated = false
        var data = getSurveyData()
        if (alertActivated) {
            return
        }
        if (!data || data.length <= 0) {
            return callback()
        }
        
        JSONPostRequest(appUrl+"/survey-receive", {
            sessionId: sessionId,
            clientId: clientId,
            surveyId: surveyId,
            surveyName: surveyName,
            accountId: accountId,
            
            device: detectMobile(),
            browser: detectBrowser(),
            path: window.location.href,
            
            data: data,
            //SURVEYS
        }, function(response) {
            callback()
        }, function(error) {
            renderServerAlertText(error)
            renderAlert(error)
        });
    }
    
    function getSurveyData() {
        var page = document.getElementById(getId(keys.PAGE_ELEMENT)) 
        var surveys = []
        for (var i = 0; i < page.children.length; i++) {
            var element = page.children[i]
            var survey = { 
                type: element.getAttribute('type'),
                id: element.getAttribute('id'),
                tags: getElementTags(element)
            }
            if (isSurveyElement(element)) {
                switch(survey.type) {
                    case(keys.MULTIPLE_CHOICE_ELEMENT): 
                    case(keys.CHECKBOX_ELEMENT): 
                        survey.question = getQuestion(element)
                        survey.value = getMultipleChoiceValue(element)
                        survey.options = getMultipleChoiceOptions(element)
                        break
                    case(keys.DROPDOWN_ELEMENT):
                        survey.question = getQuestion(element)
                        survey.value = getDropdownValue(element)
                        survey.options = getDropdownOptions(element)
                        break
                    case(keys.SLIDER_ELEMENT):
                        var slider = getSliderValue(element)
                        survey.question = getQuestion(element)
                        survey.value = slider.value
                        survey.min = slider.min
                        survey.max = slider.max
                        break
                    case(keys.FORM_ELEMENT):
                        survey.question = getQuestion(element)
                    case(keys.EMAIL_ELEMENT):
                    case(keys.PHONE_ELEMENT):
                        survey.value = getFormValue(element)
                        break
                    case(keys.ADDRESS_ELEMENT):
                    case(keys.NAME_ELEMENT):
                        survey.value = getNestedFormValue(element)
                        break
                    case(keys.LONG_FORM_ELEMENT):
                        survey.question = getQuestion(element)
                        survey.value = getLongFormValue(element)
                        break
                    default: 
                        break
                }
                validate(element, survey.value)
                surveys.push(survey)
            }
        }
        return surveys
    }

    function getElementTags(element) {
        var tags = element.getAttribute('tags')
        if (tags) {
            tags = tags.split(',')
        } else {
            tags = ''
        }
        return tags
    }
    
    function getQuestion(element) {
        var question = element.getElementsByTagName('p')[0]
        if (question.getAttribute('key') == 'question') {
            return question.innerHTML
        }
    }
    
    function getMultipleChoiceValue(element) {
        var options = element.getElementsByTagName('input')
        var optionsChecked = [];
        for (var i=0; i<options.length; i++) {
            if (options[i].checked) {
                optionsChecked.push(i);
            }
        }

        return optionsChecked
    }
    
    function getMultipleChoiceOptions(element) {
        var optionsElements = element.getElementsByTagName('label')
        var options = []
        for (var i = 0; i < optionsElements.length; i++) {
            var option = optionsElements[i]
            options.push(option.lastChild.innerHTML)
        }
        return options
    }
    
    function getDropdownValue(element) {
        var dropdown = element.getElementsByTagName('select')[0]
        return [dropdown.selectedIndex]
    }
    
    function getDropdownOptions(element) {
        var optionsElements = element.getElementsByTagName('option')
        var options = []
        for (var i = 0; i < optionsElements.length; i++) {
            var option = optionsElements[i]
            options.push(option.innerHTML)
        }
        return options
    }
    
    function getSliderValue(element) {
        var slider = element.getElementsByTagName('input')[0];
        var min = slider.getAttribute('min')
        var max = slider.getAttribute('max')
        return {
            value: Number(slider.value),
            min: min,
            max: max
        }
    }
    
    function getFormValue(element) {
        var form = element.getElementsByTagName('input')[0];
        return form.value
    }
    
    function getNestedFormValue(element) {
        var form = element.getElementsByTagName('input');
        var answers = {}
        for (var i = 0; i < form.length; i++) {
            answers[form[i].getAttribute('key')] = form[i].value
        }
        return answers
    }
    
    function getLongFormValue(element) {
        var textarea = element.getElementsByTagName('textarea')[0];
        return textarea.value
    }
    
    
    /// ========= ALERT ===============================================
    
    function getElementName(element) {
        switch(element.type) {
            case(keys.EMAIL_ELEMENT):
                return 'email'
            case(keys.PHONE_ELEMENT):    
                return 'phone number'
            case(keys.ADDRESS_ELEMENT):
                return 'address'
            case(keys.NAME_ELEMENT):
                return 'name'
            default: 
                return 'form'
        }
    }
    
    function renderAlert() {
        
    }
    
    function renderServerAlertText(errors) {
        errors = JSON.parse(errors)
        for (var i = errors.length - 1; i >= 0; i--) {
            var element = document.getElementById(errors[i].id)
            renderAlertText(element, errors[i].error)
        }
    }
    
    function getAlertTextClass() {
        var alertText = stringIntoHTML(currentSurveyOptions.alertText)
        return alertText.getAttribute('class')
    }
    
    function resetAlertText() {
        var alertTexts = document.getElementsByClassName(getAlertTextClass())
        for (var i = alertTexts.length - 1; i >= 0; i--) {
            var text = alertTexts[i]
            text.parentNode.removeChild(text)
        }
    }
    
    function renderAlertText(element, message) {
        var existingAlert = element.getElementsByClassName(getAlertTextClass())[0]
        if (existingAlert) return
        var alertText = stringIntoHTML(currentSurveyOptions.alertText)
        alertText.innerHTML = message
        element.appendChild(alertText)
    }
    
    function checkRequired(required, value, element) {
        if (value === 0) return
        if (required && (!value || value == '')) {
            alertActivated = true
            renderAlertText(element, currentSurveyOptions.alertMessages.required)
        }
    }
    
    function checkMinChar(min, value, element) {
        if (value.length < min) {
            alertActivated = true
            var message = currentSurveyOptions.alertMessages.tooShort
            message = message.replace('{{TYPE}}', getElementName(element))
            message = message.replace('{{NUMBER}}', min)
            renderAlertText(element, message)
        }
    }
    
    function checkMaxChar(max, value, element) {
        if (value.length > max) {
            alertActivated = true
            var message = currentSurveyOptions.alertMessages.tooLong
            message = message.replace('{{TYPE}}', getElementName(element))
            message = message.replace('{{NUMBER}}', max)
            renderAlertText(element, message)
        }
    }
    
    function validateChoiceElement(element, value) {
        if (element.getAttribute('type') == keys.DROPDOWN_ELEMENT) {
            if (value[0] === 0) value[0] = false
        }
        checkRequired(element.getAttribute('required'), value[0], element)
    }
    
    function validateFormElement(element, value) {
        checkRequired(element.getAttribute('required'), value, element)
        checkMinChar(element.getAttribute('min'), value, element)
        checkMaxChar(element.getAttribute('max'), value, element)
    }
    
    function validateNestedFormElement(element, value) {
        var form = element.getElementsByTagName('input');
        for (var i = 0; i < form.length; i++) {
            var key = form[i].getAttribute('key')
            checkMinChar(element.getAttribute('min'), value, element)
            checkMaxChar(element.getAttribute('max'), value, element)
            checkRequired(form[i].getAttribute('required'), value[key], element)
        }
    }
    
    function validate(element, value) {
        switch(element.getAttribute('type')) {
            case(keys.MULTIPLE_CHOICE_ELEMENT): 
            case(keys.CHECKBOX_ELEMENT): 
            case(keys.DROPDOWN_ELEMENT):
                validateChoiceElement(element, value)
                break
            case(keys.SLIDER_ELEMENT):
            case(keys.FORM_ELEMENT):
            case(keys.LONG_FORM_ELEMENT):
            case(keys.EMAIL_ELEMENT):
            case(keys.PHONE_ELEMENT):
                validateFormElement(element, value)
                break
            case(keys.ADDRESS_ELEMENT):
            case(keys.NAME_ELEMENT):
                validateNestedFormElement(element, value)
                break
            default: 
                break
        }
    }
    
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
                console.log("XHR2: ", xhr)
                if (xhr.status / 100 >= 4) {
                    return errorCallback(xhr.responseText)
                }
                return callback(JSON.parse(xhr.responseText));
            }
            catch(e) {
                console.log("X22HR: ", xhr)
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
    
    function loadGoogleFont(name) {
        /// Convert spaces in font name to '+'s.
        name = name.replace(/\s+/, "+");

        var link = document.createElement("link")
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "https://fonts.googleapis.com/css?family=" + name;
        document.head.appendChild(link);
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
    
    function stringIntoHTML(str) {
        var tempDiv = document.createElement('div')
        tempDiv.innerHTML = str
        return tempDiv.firstChild
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
})(this);