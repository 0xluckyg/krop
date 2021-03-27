const gradient = {
    //linear, radial
    type: 'linear',
    rotation: 0,
    colorStops: [
        { offset: 0, color: 'black' },
        { offset: 0, color: 'black' }
    ]
}

const defaultQR = {
    width: 300,
    height: 300,
    image: null,
    margin: 0,
    imageOptions: {
        imageSize: 0.3,
        margin: 10,
        hideBackgroundDots: true
    },
    dotsOptions: {
        color: '#000',
        // 'rounded' 'dots' 'classy' 'classy-rounded' 'square' 'extra-rounded'
        type: 'square',
        gradient: null
    },
    cornersSquareOptions: {
        color: '#000',
        // 'rounded' 'dots' 'classy' 'classy-rounded' 'square' 'extra-rounded'
        type: 'square',
        gradient: null
    },
    cornersDotOptions: {
        color: '#000',
        // 'rounded' 'dots' 'classy' 'classy-rounded' 'square' 'extra-rounded'
        type: 'square',
        gradient: null
    },
    backgroundOptions: {
        color: '#fff',
        gradient: null
    }
}

module.exports = {
    defaultQR
}