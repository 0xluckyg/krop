const defaultSettings = {
    name: 'Survey',
    device: 'both',
    path: '',
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
    importance: 1
}

module.exports = {
    defaultSettings
}