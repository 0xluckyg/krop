import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        campaignLabel: "Campaign"
    },
    kr: {
        campaignLabel: "캠페인"
    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

const defaultSettings = {
    name: strings.campaignLabel,
    device: 'both',
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