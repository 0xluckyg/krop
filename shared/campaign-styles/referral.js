const REFERRAL_CONTAINER = {
    // display: 'flex',
    // alignItems: 'center',
    margin: '15px 0px',
    transition: '0.1s',
    height: 'auto'
}

const REFERRAL_CONTAINER_DESKTOP = {
    ...REFERRAL_CONTAINER
}

const REFERRAL_BUTTON = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 100,
    width: '100%',
    border: `0.1px solid #000`,
    padding: '13px 25px',
    borderRadius: '30px',
    fontSize: '14px',
    transition: '0.1s',
    marginTop: '15px',
    outline: 'none',
    FOCUS: {
    
    },
    ACTIVE: {
        opacity: 0.6,
        transition: '0.1s'
    },
    HOVER: {
        opacity: 0.8,
        transition: '0.1s'
    }
}

const REFERRAL_BUTTON_DESKTOP = {
    ...REFERRAL_BUTTON
}

const REFERRAL_BUTTON_ICON = {
    margin: '0px',
    fill: '#000',
    width: '20px',
    height: '20px',
    display: 'inherit',
    marginRight: '10px'
}

const REFERRAL_BUTTON_ICON_DESKTOP = {
    ...REFERRAL_BUTTON_ICON
}

const REFERRAL_BUTTON_TEXT = {
    display: 'inline-block',
    margin: '0px',
    color: '#000'
}

const REFERRAL_BUTTON_TEXT_DESKTOP = {
    ...REFERRAL_BUTTON_TEXT
}

module.exports = {
    REFERRAL_CONTAINER,
    REFERRAL_CONTAINER_DESKTOP,
    REFERRAL_BUTTON,
    REFERRAL_BUTTON_DESKTOP,
    REFERRAL_BUTTON_ICON,
    REFERRAL_BUTTON_ICON_DESKTOP,
    REFERRAL_BUTTON_TEXT,
    REFERRAL_BUTTON_TEXT_DESKTOP
}