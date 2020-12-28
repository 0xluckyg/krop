import React from 'react'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles';

import Draggable  from './sub/draggable-element'
import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'

class TextPreview extends React.Component {
    constructor(props) {
        super(props)
    }
    
    getElement() {
        let {element} = this.props
        return getElement({props: this.props, selectedElement: element})
    }
    
    handleSelect(html) {
        try {
            if (!wysiwygEditor) return
            wysiwygEditor.document.getElementsByTagName('body')[0].innerHTML = html   
        } catch(err) {
            
        }
    }
    
    getStyle() {
        const {state, classes} = this.props
        const {playAnimation} = state
        const animateShow = playAnimation == keys.SHOW ? classes.showAnimation : ''
        const animateExit = playAnimation == keys.EXIT ? classes.exitAnimation : ''
        return clsx(classes.textStyle, classes.transitionAnimation, animateShow, animateExit)
    }
    
    render() {
        const {zIndex, state, setState, element, setCenterRuler, getParentDimension, sectionElement, rndScale} = this.props
        const text = this.getElement()
        
        return (
            <Draggable
                state={state}
                setState={setState}
                element={element}
                sectionElement={sectionElement}
                zIndex={zIndex}
                setCenterRuler={setCenterRuler}
                getParentDimension={getParentDimension}
                rndScale={rndScale}
            >
                <div 
                    className={this.getStyle()}
                    dangerouslySetInnerHTML={{__html: text.html}}
                    onClick={() => this.handleSelect(text.html)}
                />
            </Draggable>
        )
    }
}

function getElementFromProps(props) {
    let {element} = props
    return getElement({props, selectedElement: element})
}

function getTextStyle(props) {
    const text = getElementFromProps(props)
    const {color, cornerRounding, borderColor, borderWidth, padding, opacity, shadow, shadowColor} = text.style
    const {rotate, scale} = text.position
    return {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color,
        borderRadius: `${cornerRounding[0]}px ${cornerRounding[1]}px ${cornerRounding[2]}px ${cornerRounding[3]}px`,
        borderWidth: `${borderWidth[0]}px ${borderWidth[1]}px ${borderWidth[2]}px ${borderWidth[3]}px`,
        borderStyle: `solid`,
        borderColor,
        transform: `scale(${scale ? scale : 1}) rotateZ(${rotate[0]}deg) rotateX(${rotate[1]}deg) rotateY(${rotate[2]}deg)`,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        opacity,
        boxShadow: `${shadow[0]}px ${shadow[1]}px ${shadow[2]}px ${shadow[3]}px ${shadowColor}`,
    }
}


const useStyles = theme => ({
    textStyle: props => ({...getTextStyle(props)})
})

export default withStyles(useStyles)(TextPreview)