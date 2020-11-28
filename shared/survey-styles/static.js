const SURVEY_CONTAINER = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
}

const SURVEY_CONTAINER_DESKTOP = {
    
}

const BACKGROUND = {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    padding: '0px 30px 0px 30px',
    top: 0,
    left: 0,
    width: '100%',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

const BACKGROUND_DESKTOP = {
    ...BACKGROUND,
}

const PAGE_WRAPPER = {
    margin: 'auto',
    width: '100%',
    minHeight: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
}

const PAGE_WRAPPER_DESKTOP = {
    ...PAGE_WRAPPER,
    width: '60%'
}

const HEADING = {
    wordWrap: 'break-word'
}
const HEADING_DESKTOP = {
    ...HEADING
}

const SUBHEADING = {
    wordWrap: 'break-word'
}
const SUBHEADING_DESKTOP = {
    ...SUBHEADING
}

const PARAGRAPH = {
    wordWrap: 'break-word'
}
const PARAGRAPH_DESKTOP = {
    ...PARAGRAPH
}

const IMAGE = {
    width: '100%',
    // margin: '0px 0px'
}

const IMAGE_DESKTOP = {
    ...IMAGE
}

module.exports = {
    SURVEY_CONTAINER,
    SURVEY_CONTAINER_DESKTOP,
    
    BACKGROUND,
    BACKGROUND_DESKTOP,
    
    PAGE_WRAPPER,
    PAGE_WRAPPER_DESKTOP,
    
    HEADING,
    HEADING_DESKTOP,
    SUBHEADING,
    SUBHEADING_DESKTOP,
    PARAGRAPH,
    PARAGRAPH_DESKTOP,
    IMAGE,
    IMAGE_DESKTOP
}