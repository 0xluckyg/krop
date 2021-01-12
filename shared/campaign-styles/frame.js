const CAMPAIGN_CONTAINER = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}

const CAMPAIGN_CONTAINER_DESKTOP = {
    ...CAMPAIGN_CONTAINER
}

const CAMPAIGN_WRAPPER = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
}

const CAMPAIGN_WRAPPER_DESKTOP = {
    ...CAMPAIGN_WRAPPER
}

const BACKGROUND = {
    boxSizing: 'border-box',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    padding: '0px 30px',
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
    // minHeight: '100%',
    // height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
}

const PAGE_WRAPPER_DESKTOP = {
    ...PAGE_WRAPPER,
    width: '60%'
}

module.exports = {
    CAMPAIGN_CONTAINER,
    CAMPAIGN_CONTAINER_DESKTOP,
    
    CAMPAIGN_WRAPPER,
    CAMPAIGN_WRAPPER_DESKTOP,
    
    BACKGROUND,
    BACKGROUND_DESKTOP,
    
    PAGE_WRAPPER,
    PAGE_WRAPPER_DESKTOP
}