import React from 'react';
import clsx from 'clsx'
import Masonry from 'react-masonry-component'

import { withStyles } from '@material-ui/core/styles';
import keys from '../../../config/keys'

class CompiledElement extends React.Component {      
    constructor(props) {
        super(props)
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

    render() {
        const masonryOptions = {
            transitionDuration: 0
        };
         
        const imagesLoadedOptions = { background: '.my-bg-image-el' }
        const {classes, state, templates, handleScroll} = this.props
        return <div onScroll={(e) => handleScroll(e)} className={classes.list}>
            <Masonry
                ref={function(c) {this.masonry = this.masonry || c.masonry;}.bind(this)}
                options={masonryOptions}
                updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
                imagesLoadedOptions={imagesLoadedOptions}
            >
                {templates.map((t, i) => {
                    const {media,mediaSmall,mediaType} = t
                    const cardStyle = state.selectedCard == i ? 
                    clsx(classes.imageStyle, classes.selectedCard) : classes.imageStyle
                    
                    if (mediaType == keys.SVG_PROPERTY) {
                        return (
                            <span
                                key={'key' + i}
                                className={cardStyle}
                                onClick={() => this.handleCardSelect(i)}
                                dangerouslySetInnerHTML={{__html: media}}>
                            </span>
                        )
                    } else {
                        return (
                            <img onClick={() => this.handleCardSelect(i)} src={mediaSmall ? mediaSmall : media} className={cardStyle}/>
                        )   
                    }
                })}
            </Masonry>
        </div>
    }
}

const sizeMultiplier = 3.5
const useStyles = theme => ({
    list: {
        height: '100%',
        width: '100%',
        padding: 30,
        overflowY: 'scroll'
    },
    imageStyle: props => {
        let {width, padding} = props.category
        width = width ? width : 25
        return {
            width: width + '%',
            padding: padding ? padding : 10,
            cursor: 'pointer'
        }
    },
    selectedCard: {
        transition: '0.1s',
        opacity: 0.3,
        transform: 'translate(0px, -10px)'
    },
});

export default withStyles(useStyles)(CompiledElement)