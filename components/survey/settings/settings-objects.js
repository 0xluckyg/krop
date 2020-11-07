const defaultSettings = {
    name: '',
    device: 'both',
    showAfter: {
        //visits, duration, instant
        type: 'instant',
        visits: 0,
        duration: {
            d: 0, h: 0, m: 0, s:30
        }
    },
    wait: 0,
    onExit: false,
    onScroll: {
        enabled: false,
        percent: 30
    },
    onPages: {
        //all, specific
        enabled: false,
        locations: ['/']
    },
    hideAfter: {
        //visits, duration, seen, none
        type: 'none',
        visits: 1,
        views: 1,
        duration: {
            d: 0, h: 0, m: 0, s:30
        }
    },
    schedule: {
        //always, repeat, schedule
        type: 'always',
        from: 101,
        to: 1231,
        fromOverflow: 101,
        toOverflow: 1231,
        fromYear: 0,
        toYear: 3000
    },
    importance: 1,
    integrations: {
        mailchimp: {
            listId: null,
            listName: 'none'
        },
        klaviyo: {
            listId: null,
            listName: 'none'
        },
    }
}

module.exports = {
    defaultSettings
}