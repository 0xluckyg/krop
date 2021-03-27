import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LocalizedStrings from 'react-localization';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import keys from '../../../config/keys'
import ColorPicker from '../../reusable/color-picker'
import Slider from '../design/element-editor/sub/slider-field'
import Selector from '../design/element-editor/sub/selector'
import ImageUploader from '../design/element-editor/sub/image-uploader'

let strings = new LocalizedStrings({
    us:{

    },
    kr: {

    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

//A pop up to ask users to login or signup
class QrStyleEditor extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            selectedStyle: 0
        }
    }

    renderStyleTags() {
        const { classes } = this.props;
        const styles = [
            "Size",
            "Logo",
            "Dots",
            "Corners",
            "Background"
        ]
        
        return <div className={classes.tagsContainer}>
            {styles.map((style, i) => {
                let className = classes.tags
                if (this.state.selectedStyle == i) {
                    className = clsx(classes.tags, classes.tagsSelected)
                }
                return <div onClick={() => {
                    this.setState({selectedStyle: i})
                }}className={className}>
                    {style}
                </div>
            })}
        </div>
    }

    colorEditor(qr, optionType) {
        return <ColorPicker
            text={"Color"}
            color={qr[optionType].color}
            onChange={color => {
                qr[optionType].color = color
                if (qr[optionType].gradient != null) {
                    qr[optionType].gradient.colorStops[0].color = color
                }
                this.props.setState({qr})
            }}
        />
    }

    typeSelector(qr, optionType, options) {
        return <Selector
            label="Type"
            onChange={(value) => {
                qr[optionType].type = value
                this.props.setState({qr})
            }}
            options={options ? options : ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded']}
            value={qr[optionType].type}
        />
    }

    gradientEditor(qr, optionType) {
        return <React.Fragment>
                <div className={this.props.classes.switch}><FormControlLabel
                control={
                    <Switch
                    checked={qr[optionType].gradient != null}
                    onChange={() => {
                        if (qr[optionType].gradient == null) {
                            qr[optionType].gradient = {
                                type: 'linear',
                                rotation: 45,
                                colorStops: [
                                    { offset: 0, color: qr[optionType].color },
                                    { offset: 1, color: 'rgba(0,0,0,1)' }
                                ]
                            }
                            this.props.setState({qr})
                        } else {
                            qr[optionType].gradient = null
                            this.props.setState({qr})
                        }
                    }}
                    color="primary"
                    />
                }
                label="Color Gradient"
            /></div>
            {(qr[optionType].gradient != null) ? 
                <ColorPicker
                    text={"Gradient Color"}
                    color={qr[optionType].gradient.colorStops[1].color}
                    onChange={color => {
                        qr[optionType].gradient.colorStops = [
                            { offset: 0, color: qr[optionType].color },
                            { offset: 1, color }
                        ]
                        this.props.setState({qr})
                    }}
                />
            : null}</React.Fragment>
    }

    sizeEditor() {
        let qr = {...this.props.state.qr}
        return <div>
            <Slider
                textChange={event => {
                    if (isNaN(event.target.value)) return
                    qr.width = event.target.value
                    qr.height = event.target.value
                    this.props.setState({qr})
                }}
                sliderChange={(event, value) => {
                    qr.width = value
                    qr.height = value
                    this.props.setState({qr})
                }}
                value={qr.width}
                label={"Size"}
                min={100}
                max={1000}
                step={1}
            />
            <Slider
                textChange={event => {
                    if (isNaN(event.target.value)) return
                    qr.margin = event.target.value
                    this.props.setState({qr})
                }}
                sliderChange={(event, value) => {
                    qr.margin = value
                    this.props.setState({qr})
                }}
                value={qr.margin}
                label={"Margin"}
                min={0}
                max={100}
                step={1}
            />
        </div>
    }

    logoEditor() {
        let qr = {...this.props.state.qr}
        return <div>
            <ImageUploader 
                value={qr.image ? qr.image : null}
                setValue={(value) => {
                    qr.image = value
                    this.props.setState({qr})
                }}
            />
            <Slider
                textChange={event => {
                    if (isNaN(event.target.value)) return
                    qr.imageOptions.imageSize = event.target.value
                    this.props.setState({qr})
                }}
                sliderChange={(event, value) => {
                    qr.imageOptions.imageSize = value
                    this.props.setState({qr})
                }}
                value={qr.imageOptions.imageSize}
                label={"Logo Size"}
                min={0}
                max={1}
                step={0.1}
            />
            <Slider
                textChange={event => {
                    if (isNaN(event.target.value)) return
                    qr.imageOptions.margin = event.target.value
                    this.props.setState({qr})
                }}
                sliderChange={(event, value) => {
                    qr.imageOptions.margin = value
                    this.props.setState({qr})
                }}
                value={qr.imageOptions.margin}
                label={"Logo Margin"}
                min={0}
                max={20}
                step={1}
            />
        </div>
    }

    dotEditor() {
        let qr = {...this.props.state.qr}
        return <div>
            {this.typeSelector(qr, "dotsOptions")}
            {this.colorEditor(qr, "dotsOptions")}
            {this.gradientEditor(qr, "dotsOptions")}
        </div>
    }

    cornerEditor() {
        let qr = {...this.props.state.qr}
        return <div>
            <h4>Corner outline</h4>
            {this.typeSelector(qr, "cornersSquareOptions", ['dot', 'square', 'extra-rounded'])}
            {this.colorEditor(qr, "cornersSquareOptions")}
            {this.gradientEditor(qr, "cornersSquareOptions")}
            {/* <br/> */}
            <h4>Corner dot</h4>
            {this.typeSelector(qr, "cornersDotOptions", ['dot', 'square'])}
            {this.colorEditor(qr, "cornersDotOptions")}
            {this.gradientEditor(qr, "cornersDotOptions")}
        </div>
    }

    backgroundEditor() {
        let qr = {...this.props.state.qr}
        return <div>
            {this.colorEditor(qr, "backgroundOptions")}
            {this.gradientEditor(qr, "backgroundOptions")}
        </div>
    }

    renderEditor() {
        let selected = this.state.selectedStyle
        switch(selected) {
            case(0):
                return this.sizeEditor()
            case(1):
                return this.logoEditor()
            case(2):
                return this.dotEditor()
            case(3):
                return this.cornerEditor()
            case(4):
                return this.backgroundEditor()
            default:
                return this.sizeEditor()
        }
    }

    render() {
        const { classes } = this.props;
        return(
            <div className={classes.container}>
                <div className={classes.styles}>
                    <h2>1. Select Style</h2>
                    {this.renderStyleTags()}
                </div>
                <div className={classes.editor}>
                    <h2>2. Edit Style</h2>
                    {this.renderEditor()}
                </div>
            </div>            
        )
    }
}

const useStyles = theme => ({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row'
        // backgroundColor: 'grey'
    },
    styles: {
        flex: 1,
        paddingRight: 30,
        borderRight: '1px solid grey'
    },
    editor: {
        flex: 1,
        overflowY: 'auto',
        paddingRight: 30,
        paddingLeft: 30,
        borderRight: '1px solid grey'
    },
    switch: {
        padding: "15px 0px 10px 0px"
    },
    tags: {
        display: 'inline-block',
        backgroundColor: keys.APP_COLOR_GRAY,
        margin: '0px 10px 5px 0px',
        padding: '7px 13px',
        borderRadius: 20,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: keys.APP_COLOR_GRAY_DARK
        },
        fontSize: 13,
        fontWeight: 700
    },
    tagsSelected: {
        backgroundColor: keys.APP_COLOR_GRAY_DARKER,
        '&:hover': {
            backgroundColor: keys.APP_COLOR_GRAY_DARKER
        },
    }
});

export default withStyles(useStyles)(QrStyleEditor);