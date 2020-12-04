//PRIVATE SCOPE
/** Wrap everything so we're fully isolated from the global scope. */
(function(Host) {

    /// ========= CONFIGURATION ================================================

    var appUrl = "{{APP_URL}}"
    var appName = "{{APP_NAME}}"
    var accountId = "{{ACCOUNT_ID}}"

    /// ========= GLOBAL VARIABLES =========================================
    
    var keys = {
        STAGE: 'stage',
        WIDGET: 'widget',
        STYLE: 'style',
        
        MOBILE_PROPERTY: 'mobile',
        DESKTOP_PROPERTY: 'desktop',
        TABLET_PROPERTY: 'tablet',
        
        SUBMIT_ACTION: 'submit'
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
        var domain = Host.domain || location.host;
        var device = detectMobile()
        JSONPostRequest(surveyOptionsUrl, {
            domain: domain,
            device: device,
            accountId: accountId
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
    
    function initiateSurvey() {
        loadGoogleFont(currentSurveyOptions.font)
        var stages = currentSurveyOptions.stages
        var frame = currentSurveyOptions.frame
        
        // saveVisit()
        // saveInfo()
    }
    
    function initiateStyle() {
        var css = currentSurveyOptions.css
        var stylesheet = document.createElement('style')
        stylesheet.innerHTML = css
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
    
    function getId(type, stageIndex, elementIndex) {
        let id = appName+"__"+type
        if (stageIndex || stageIndex === 0) {
            id = id + `__${stageIndex}`
        }
        if (elementIndex || elementIndex === 0) {
            id = id + `__${elementIndex}`
        }
        return id
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