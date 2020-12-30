import React from 'react'
import QRCode from 'qrcode.react';

import { withStyles } from '@material-ui/core/styles';

import Draggable  from './sub/draggable-element'
import {getElement} from '../element-editor/sub/functions'
import keys from '../../../../config/keys'

class QrPreview extends React.Component {
    constructor(props) {
        super(props)
    }

    getElement() {
        const {element} = this.props
        return getElement({
            props: this.props, 
            selectedElement: element
        })
    }
    
    render() {
        const {classes, zIndex, state, setState, element, setCenterRuler, getParentDimension, sectionElement, rndScale} = this.props
        const qrElement = this.getElement()
        const {value, style, position} = qrElement
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
                <QRCode 
                    value={value}
                    size={position.width}
                    fgColor={style.color}
                    includeMargin
                />
            </Draggable>
        )
    }
}

function getElementFromProps(props) {
    let {element} = props
    return getElement({props, selectedElement: element})
}

function getBoxStyle(props) {
    const box = getElementFromProps(props)
    const {color, cornerRounding, borderColor, borderWidth, opacity, shadow, padding, shadowColor} = box.style
    const {rotate, scale} = box.position
    
    return {
        height: '100%',
        width: '100%',
        backgroundColor: color,
        borderRadius: `${cornerRounding[0]}px ${cornerRounding[1]}px ${cornerRounding[2]}px ${cornerRounding[3]}px`,
        borderWidth: `${borderWidth[0]}px ${borderWidth[1]}px ${borderWidth[2]}px ${borderWidth[3]}px`,
        borderStyle: `solid`,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        borderColor,
        opacity,
        transform: `scale(${scale ? scale : 1}) rotateZ(${rotate[0]}deg) rotateX(${rotate[1]}deg) rotateY(${rotate[2]}deg)`,
        boxShadow: `${shadow[0]}px ${shadow[1]}px ${shadow[2]}px ${shadow[3]}px ${shadowColor}`,
    }
}

const useStyles = theme => ({
    boxStyle: props => ({...getBoxStyle(props)}),
})

export default withStyles(useStyles)(QrPreview)