import React from 'react';
import clsx from 'clsx'
import Masonry from 'react-masonry-component'

import { withStyles } from '@material-ui/core/styles';
import keys from '../../../config/keys'
import {loadFonts} from '../../../components/reusable/font-families'

class CompiledElement extends React.Component {      
    constructor(props) {
        super(props)
        this.containerRef = React.createRef()
        
        this.state = {
            containerWidth: null,
            containerHeight: null
        }
    }
  
    componentDidMount() {
        if (this.containerRef.current) {
            const {offsetWidth} = this.containerRef.current
            this.setState({containerWidth: offsetWidth})
        }
    }
    
    configureElement(template) {
        if (template.template && template.template.fonts) {
            loadFonts(document, template.template.fonts)
        }
    }
    
    handleScroll(e) {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        const {state} = this.props
        const {hasNext, page} = state
        if (bottom && hasNext) {
            this.props.fetch(page + 1)
        }
    }
    
    handleCardSelect(i) {
        if (this.props.state.selectedCard == i) {
            this.props.setState({
                selectedCard: null,
                name: ''
            })    
        } else {
            this.props.setState({
                selectedCard: i,
                name: this.props.state.templates[i].name ? this.props.state.templates[i].name : 'Template'
            })
        }
    }
    
    getElementHTML(template) {
        if (template.template.type === keys.ALERT) {
            let div = document.createElement('div')
            div.innerHTML = template.compiled.html
            div = div.firstChild
            div.innerHTML = '<span>Example alert text</span>'
            return div.outerHTML
        } else {
            return template.compiled.html
        }
    }
    
    compileElement(template) {
        const html = this.getElementHTML(template)
        
        let {width,height, widthType, heightType} = template.template.position
        if (heightType == 'percent') { height = height + '%' }
        
        const cellRatio = 100 / this.props.category.width
        let scaler = 1
        if (widthType != 'percent') {
            let containerWidth = (this.containerRef && this.containerRef.current) ? this.containerRef.current.offsetWidth : this.state.containerWidth
            let sizeLimit = (containerWidth / cellRatio) - 60
            if (sizeLimit < width) {
                scaler = sizeLimit / width
            }
        }
        const elementStyle = {
            height,
            transform: `scale(${scaler})`
        }
        
        return <div style={elementStyle} dangerouslySetInnerHTML={{__html: html}} />
    }

    renderCSS(template) {
        const css = template.compiled.css
        return (
            <style>
                {css}
            </style>    
        )
    }

    render() {
        const masonryOptions = {
            transitionDuration: 0
        };
         
        const imagesLoadedOptions = { background: '.my-bg-image-el' }
        const {classes, state, templates, handleScroll} = this.props
        return <div ref={this.containerRef} onScroll={(e) => handleScroll(e)} className={classes.list}>
            <Masonry
                options={masonryOptions}
                updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
                imagesLoadedOptions={imagesLoadedOptions}
            >
                {templates.map((t, i) => {
                    const cardStyle = state.selectedCard == i ? 
                    clsx(classes.card, classes.selectedCard) : classes.card
                    return (
                        <div key={i} onClick={() => this.handleCardSelect(i)} className={cardStyle}>
                            {this.renderCSS(t)}
                            {this.configureElement(t)}
                            {this.compileElement(t)}
                        </div>
                    )
                })}
            </Masonry>
        </div>
    }
}

const useStyles = theme => ({
    list: {
        height: '100%',
        width: '100%',
        padding: 30,
        overflowY: 'scroll'
    },
    card: props => {
        let {width, padding} = props.category
        width = width ? width : 50
        return {
            width: width + '%',
            padding: padding ? padding : 10,
            cursor: 'pointer',
        }
    },
    selectedCard: {
        transition: '0.1s',
        opacity: 0.3,
        transition: '0.1s',
        transform: 'translate(0px, -10px)'
    }
});

export default withStyles(useStyles)(CompiledElement)