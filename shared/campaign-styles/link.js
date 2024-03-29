const LINK = {
    display: 'inline-block',
    cursor: 'pointer',
    transition: '0.2s',
    textDecoration: 'none',
    BEFORE: {
        pointerEvents: 'none',
        content: "'\\27A4'",
        marginRight: 10,
        height: 30,
        lineHeight: 30 + 'px',
    },
    HOVER: {
        opacity: 0.8,
        transition: '0.2s'
    },
    ACTIVE: {
        opacity: 0.6,
        transition: '0.2s'
    }
}
const LINK_DESKTOP = {
    ...LINK
}

module.exports = {
    LINK,
    LINK_DESKTOP
}