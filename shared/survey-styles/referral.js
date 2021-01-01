const REFERRAL_CONTAINER = {
    // display: 'flex',
    // alignItems: 'center',
    margin: '15px 0px',
    transition: '0.1s',
    height: 'auto',
    HOVER: {
        opacity: 0.8,
        transition: '0.1s'
    }
}

const REFERRAL_CONTAINER_DESKTOP = {
    ...REFERRAL_CONTAINER
}

const REFERRAL_BUTTON = {
    cursor: 'pointer',
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 100,
    width: '100%',
    border: `0.3px solid rgba(0,0,0,0.3)`,
    padding: '15px 25px',
    borderRadius: 30,
    fontSize: 14,
    transition: '0.1s',
    FOCUS: {
        border: 0,
        transition: '0.1s'
    },
    ACTIVE: {
        opacity: 0.6,
        transition: '0.1s'
    }
}

const REFERRAL_BUTTON_DESKTOP = {
    ...REFERRAL_BUTTON
}

module.exports = {
    REFERRAL_CONTAINER,
    REFERRAL_CONTAINER_DESKTOP,
    REFERRAL_BUTTON,
    REFERRAL_BUTTON_DESKTOP
}