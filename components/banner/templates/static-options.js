const keys = require('../../../config/keys')
import ElementPreview from './element-preview'
import MediaPreview from './media-preview'
import WidgetPreview from './widget-preview'

const templateQuery = '/get-templates'
const mediaQuery = '/get-media-templates'
const pexelsQuery = '/get-pexels-templates'
const giphyQuery = ''

const iconTags = [
    "arrow",
    "cancel",
    "download",
    "icons",
    "bold",
    "edit",
    "tools",
    "close",
    "signs",
    "storage",
    "business",
    "inbox",
    "online",
    "education",
    "technology",
    "media",
    "zoom",
    "shopping",
    "social",
    "back",
    "rotate",
    "image",
    "file",
    "nature",
    "animal",
    "cloud",
    "ui",
    "click",
    "move",
    "drag",
    "video",
    "cursor",
    "photo"
]

const shapeTags = [
    "blob",
    "arrows",
    "chart",
    "basic",
    "wave",
    "iceburg",
    "animal",
    "card",
    "weather",
    "message"
]

const badgeTags = [
    "spring ",
    "summer ",
    "fall",
    "winter ",
    "new years",
    "valentines ",
    "mother's day",
    "father's day ",
    "parent's day",
    "halloween",
    "thanksgiving day",
    "black friday",
    "cyber monday",
    "christmas",
    "technology",
    "software",
    "business",
    "education",
    "fashion",
    "food",
    "logistics",
    "charts",
    "diagrams",
    "web design",
    "event",
    "gym",
    "america",
    "avatar",
    "emoji",
    "love",
    "email",
    "culture",
    "beauty",
    "party",
    "geography",
    "map",
    "country",
    "korea",
    "birthday",
    "phone",
    "tour",
    "game",
    "sports",
    "awards",
    "manufacturing",
    "sale",
    "animal",
    "camping",
    "science",
    "logo",
    "paypal",
    "visa",
    "mastercard",
    "guarantee",
    "free",
    "shopping"
]
const illustrationTags = [
    "chart",
    "share",
    "logo",
    "card",
    "settings",
    "text",
    "gift",
    "online",
    "creative",
    "business",
    "website",
    "photo",
    "profile",
    "mobile",
    "inbox",
    "nature",
    "information",
    "app",
    "design",
    "data",
    "button",
    "ux",
    "stock",
    "love",
    "party",
    "camping",
    "shopping",
    "job",
    "learning",
    "video",
    "chat",
    "progress",
    "home",
    "product",
    "audio",
    "crypto",
    "cooking",
    "reading",
    "web",
    "medical",
    "conference",
    "social",
    "world",
    "build",
    "download",
    "fitness",
    "investment",
    "art",
    "welcome",
    "feeling",
    "calendar",
    "certification",
    "location",
    "cloud",
    "analysis",
    "car",
    "team",
    "account",
    "work",
    "factory",
    "friends",
    "date",
    "travel",
    "article",
    "xmas",
    "tutorial",
    "authentication",
    "environmental",
    "project",
    "pay",
    "delivery",
    "code",
    "spooky",
    "unicorn",
    "abstract",
    "healthy",
    "connection",
    "image",
    "people",
    "thought",
    "story",
    "smart",
    "weather",
    "animating",
    "futuristic",
    "female",
    "male",
    "heatmap",
    "referral",
    "dream",
    "trendy",
    "pet",
    "fresh",
    "ideas",
    "activity",
    "group",
    "hangout",
    "chats",
    "newspaper",
    "winter",
    "summer",
    "spring",
    "fall",
    "developer",
    "clean",
    "art",
    "goals",
    "everyday",
    "fun",
    "click",
    "money",
    "influencer",
    "flowers",
    "happy",
    "mathematics",
    "album",
    "road",
    "speech",
    "server",
    "city",
    "personal",
    "fashion",
    "multitasking",
    "coffee",
    "page",
    "software",
    "financial",
    "dog",
    "ninja",
    "growth",
    "career",
    "followers",
    "hiking",
    "timeline",
    "discount",
    "festivities",
    "mind",
    "christmas",
    "game",
    "construction",
    "gifts",
    "logistics",
    "vehicle",
    "prototyping",
    "robotics",
    "revenue",
    "wallet",
    "warning",
    "winners",
    "features",
    "interview",
    "questions",
    "children",
    "security",
    "thank",
    "site",
    "dashboard",
    "envelope",
    "preferences",
    "trip",
    "science",
    "conversation",
    "studying",
    "school",
    "list",
    "music",
    "startup",
    "doctor",
    "birthday",
    "park",
    "loading",
    "successful",
    "beach",
    "community",
    "gdpr",
    "podcast",
    "friendship",
    "artifitial intelligence",
    "bitcoin",
    "checklist",
    "movie",
    "setup",
    "mail",
    "woman",
    "blog",
    "map",
    "credit card"
]


const widgetShapeTags = [
    'popup', 
    'header', 
    'footer', 
    'side panel', 
    'tab', 
    'full page'
]
const styleTags = [
    'minimalistic', 
    'colorful', 
    'basic',
    'edgy',
    'round'
]
const holidayTags = [
    'spring', 
    'summer', 
    'fall', 
    'winter', 
    'new years', 
    'valentines', 
    "mother's day", 
    "father's day", 
    "parent's day", 
    'halloween', 
    'thanksgiving day', 
    'bfcm', 
    'christmas'
]
const campaignTags = [
    'b2b',
    'b2c',
    'customer satisfaction',
    'market research',
    'service',
    'design campaign',
]
const formTags = [
    'mixed',
    'email',
    'mobile',
    'client',
    'address'
]

const media = {
    tags: [
        ...styleTags
    ],
    name: "Deesign / Media",
    options: [
        {
            tags: badgeTags,
            query: mediaQuery,
            category: keys.BADGE_CATEGORY,
            templateType: keys.MEDIA_TEMPLATE,
            text: 'Badges / Icons',
            render: MediaPreview,
            width: 10,
            padding: 25
        },
        {
            tags: badgeTags,
            query: pexelsQuery,
            category: keys.PHOTOGRAPH_CATEGORY,
            templateType: keys.MEDIA_TEMPLATE,
            text: 'Photos (Pexels)',
            render: MediaPreview,
            width: 25,
            padding: 10
        },
        {
            tags: illustrationTags,
            query: mediaQuery,
            category: keys.ILLUSTRATION_CATEGORY,
            templateType: keys.MEDIA_TEMPLATE,
            text: 'Illustrations',
            render: MediaPreview,
            width: 25,
            padding: 40
        },
        {
            tags: shapeTags,
            query: mediaQuery,
            category: keys.SHAPE_CATEGORY,
            templateType: keys.MEDIA_TEMPLATE,
            text: 'Shapes',
            render: MediaPreview,
            width: 10,
            padding: 25
        },
        {
            tags: iconTags,
            query: mediaQuery,
            category: keys.ICON_CATEGORY,
            templateType: keys.MEDIA_TEMPLATE,
            text: 'Icons',
            render: MediaPreview,
            width: 10,
            padding: 25
        }
        // {
        //     query: mediaQuery,
        //     category: keys.IMAGE_CATEGORY,
        //     templateType: keys.MEDIA_TEMPLATE,
        //     text: 'Images',
        //     render: MediaPreview
        // },
        // {
        //     query: giphyQuery,
        //     category: keys.GIF_CATEGORY,
        //     templateType: keys.MEDIA_TEMPLATE,
        //     text: 'Gifs',
        //     render: MediaPreview
        // }
    ]
}

const campaignElement = {
    tags: [
        ...campaignTags
    ],
    name: "Campaigns",
    options: [
        {
            query: templateQuery,
            category: keys.OPTIONS_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Visual Options',
            render: ElementPreview
        },
        {
            query: templateQuery,
            category: keys.MULTIPLE_CHOICE_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Multiple Choice',
            render: ElementPreview
        },
        {
            query: templateQuery,
            category: keys.CHECKBOX,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Checkbox',
            render: ElementPreview
        },
        {
            query: templateQuery,
            category: keys.SLIDER_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Rating',
            render: ElementPreview
        },
        {
            query: templateQuery,
            category: keys.LONG_FORM_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Long Answer',
            render: ElementPreview
        },
        {
            query: templateQuery,
            category: keys.DROPDOWN_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Dropdown',
            render: ElementPreview
        }
    ]
}

const element = {
    tags: [
        ...styleTags
    ],
    name: "Elements",
    options: [
        {
            query: templateQuery,
            category: keys.TEXT_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Texts',
            render: ElementPreview,
            width: 50
        },
        {
            query: templateQuery,
            category: keys.BUTTON_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Buttons',
            render: ElementPreview,
            width: 20
        },
        {
            query: templateQuery,
            category: keys.BOX_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Boxes',
            render: ElementPreview,
            width: 25,
            padding: 40
        },
        {
            query: templateQuery,
            category: keys.VIDEO_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Videos',
            render: ElementPreview,
            width: 50
        },
        {
            query: templateQuery,
            category: keys.SHARE_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Share',
            render: ElementPreview,
            width: 25
        },
        {
            tags: [ ...formTags ],
            query: templateQuery,
            category: keys.FORM_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Form',
            render: ElementPreview,
            width: 50
        },
        {
            query: templateQuery,
            category: keys.SECTION_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Section',
            render: ElementPreview,
            width: 50
        },
        {
            query: templateQuery,
            category: keys.MAINBOARD_ELEMENT_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Mainboard',
            render: WidgetPreview
        },
        {
            query: templateQuery,
            category: keys.TAB_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Tab',
            render: WidgetPreview,
            width: 20
        },
        {
            query: templateQuery,
            category: keys.ALERT_CATEGORY,
            templateType: keys.ELEMENT_TEMPLATE,
            text: 'Alert',
            render: WidgetPreview,
            width: 25
        },
    ]
}

const widget = {
    name: "Widgets",
    options: [
        // {
        //     tags: [
        //         ...campaignTags  
        //     ],
        //     query: templateQuery,
        //     category: keys.CAMPAIGN_WIDGET_CAREGORY,
        //     templateType: keys.WIDGET,
        //     text: 'Campaigns',
        //     render: WidgetPreview
        // },
        {
            tags: [
                ...widgetShapeTags, formTags
            ],
            query: templateQuery,
            category: keys.LEAD_WIDGET_CATEGORY,
            templateType: keys.WIDGET,
            text: 'Lead Generation',
            render: WidgetPreview
        },
        // {
        //     tags: [
        //         holidayTags
        //     ],
        //     query: templateQuery,
        //     category: keys.EVENT_WIDGET_CATEGORY,
        //     templateType: keys.WIDGET,
        //     text: 'Holidays / Events',
        //     render: WidgetPreview
        // },
    ]
}

let templateOptionsExport = {}
templateOptionsExport[keys.WIDGET_TEMPLATE] = widget
templateOptionsExport[keys.ELEMENT_TEMPLATE] = element
templateOptionsExport[keys.CAMPAIGN_ELEMENT_TEMPLATE] = campaignElement
templateOptionsExport[keys.MEDIA_TEMPLATE] = media

export default templateOptionsExport