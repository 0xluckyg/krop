const defaultSettings = {
    name: '',
    device: 'both',
    domain: '',
    schedule: {
        //always, repeat, schedule
        type: 'always',
        from: 101,
        to: 1231,
        fromOverflow: 101,
        toOverflow: 1231,
        fromYear: 0,
        toYear: 3000
    }
}

module.exports = {
    defaultSettings
}