const ALERT_TEXT = {
    fontSize: 12,
    // marginTop: 20
}
const ALERT_TEXT_DESKTOP = {
    ...ALERT_TEXT
}

const ALERT_POPUP = {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 0px',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    right: 0,
}

const ALERT_POPUP_DESKTOP = {
    ...ALERT_POPUP
}

const ALERT_POPUP_TEXT = {
    fontSize: 15,
    margin: 0,
    textAlign: 'center',
    width: '100%'
}

const ALERT_POPUP_TEXT_DESKTOP = {
    ...ALERT_POPUP_TEXT
}

module.exports = {
    ALERT_POPUP,
    ALERT_POPUP_DESKTOP,
    ALERT_POPUP_TEXT,
    ALERT_POPUP_TEXT_DESKTOP,
    
    ALERT_TEXT,
    ALERT_TEXT_DESKTOP
}