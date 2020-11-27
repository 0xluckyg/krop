const BACKGROUND = {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    padding: 30,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    flex: 1,
    overflowY: 'scroll'
}

const BACKGROUND_DESKTOP = {
    ...BACKGROUND,
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
    margin: '30px 0px'
}

const IMAGE_DESKTOP = {
    ...IMAGE
}

module.exports = {
    BACKGROUND,
    BACKGROUND_DESKTOP,
    
    HEADING,
    HEADING_DESKTOP,
    SUBHEADING,
    SUBHEADING_DESKTOP,
    PARAGRAPH,
    PARAGRAPH_DESKTOP,
    IMAGE,
    IMAGE_DESKTOP
}