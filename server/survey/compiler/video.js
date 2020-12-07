const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const shortid = require('shortid')

const {getCSS, createId, createClassName} = require('../compiler/functions')
const keys = require('../../../config/keys')
const mediaStyles = require('../../../shared/survey-styles/media')

const videoContainerClass = createClassName({
    type: keys.VIDEO_ELEMENT,
    uid: shortid.generate()
})

const videoClass = createClassName({
    type: 'video',
    uid: shortid.generate()
})

function compileVideoHTML(options) {
    const videoId = createId({
        type: keys.VIDEO_ELEMENT
    })
    
    const dom = new JSDOM('')
    const document = dom.window.document
    
    const {url} = options.element
    
    if (!url || url == '') return document.createElement('span')
    
    let videoContainer = document.createElement('div');
    videoContainer.setAttribute('id', videoId)
    videoContainer.setAttribute('class', videoContainerClass)
    
    let video = document.createElement('iframe');
    video.setAttribute('class', videoClass)
    video.setAttribute('src', url + "?controls=0&autoplay=1")
    video.innerHTML = url
    
    videoContainer.appendChild(video)
    
    return videoContainer
}

function compileVideoCSS(options) {
    let videoContainerCSS = getCSS(videoContainerClass, {
        ...mediaStyles.VIDEO_CONTAINER
    })
    
    let borderRadius = options.element.rounding ? '20px' : '0px'
    let videoCSS = getCSS(videoClass, {
        borderRadius,
        ...mediaStyles.VIDEO
    })

    return videoContainerCSS + videoCSS 
}

module.exports = {compileVideoHTML, compileVideoCSS}