import React from 'react';
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles';

import {loadFonts} from '../../../components/reusable/font-families'
import keys from '../../../config/keys'

class CompiledElement extends React.Component {      
    constructor(props) {
        super(props)
    }
    
    handleScroll(e) {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        const {state} = this.props
        const {hasNext, page} = state
        if (bottom && hasNext) {
            this.props.fetchTemplates({
                page: page + 1
            })
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
    
    configureElement(template) {
        if (template.template && template.template.fonts) {
            loadFonts(document, template.template.fonts)
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
        return <div dangerouslySetInnerHTML={{__html: html}} />
    }
    
    compileWidget(template) {
        const {stages, background} = template.compiled
        
        let wrapper= document.createElement('div');
        var stage = stages[0]
        if (background) {
            wrapper.innerHTML = background
            wrapper = wrapper.firstChild
            wrapper.innerHTML = stage
        } else {
            wrapper.innerHTML = stage
        }
        
        const tab = template.compiled.tab
        if (tab) {
            var tempWrapper = document.createElement('div')
            tempWrapper.innerHTML = tab
            wrapper.appendChild(tempWrapper.firstChild)
        }

        return <div dangerouslySetInnerHTML={{__html: wrapper.outerHTML}} />
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
        const {classes, state, templates} = this.props
        return <div onScroll={(e) => this.props.handleScroll(e)} className={classes.list}>
            {templates.map((t, i) => {
                const cardStyle = state.selectedCard == i ? 
                clsx(classes.card, classes.selectedCard) : classes.card
                return (
                    <div key={i} onClick={() => this.handleCardSelect(i)} className={cardStyle}>
                        {this.renderCSS(t)}
                        {this.configureElement(t)}
                        <div className={classes.virtualBackground}>
                            {
                                (t.compiled.html) ? this.compileElement(t) : this.compileWidget(t)
                            }
                        </div>
                    </div>
                )
            })}
        </div>
    }
}

const sizeMultiplier = 3.5
const useStyles = theme => ({
    list: {
        width: '100%',
        padding: 30,
        display: 'grid',
        gridGap: '10px',
        gridTemplateColumns: 'repeat( auto-fill, minmax(300px, 1fr) )',
        gridAutoRows: 'minmax(220px, auto)',
        justifyItems: 'center',
        overflowY: 'scroll'
    },
    card: {
        borderRadius: 5,
        transition: '0.1s',
        width: 300,
        height: 190,
        backgroundColor: keys.APP_COLOR_GRAY,
        cursor: 'pointer',
        position: 'relative',
        margin: 10,
        '&:hover': {
            opacity: 0.7,
            transition: '0.2s'
        }
    },
    selectedCard: {
        transition: '0.1s',
        opacity: 0.3,
        transition: '0.1s',
        transform: 'translate(0px, -10px)'
    },
    virtualBackground: {
        width: 300 * sizeMultiplier,
        height: 190 * sizeMultiplier,
        transformOrigin: 'top left',
        transform: `scale(${1 / sizeMultiplier}, ${1 / sizeMultiplier})`
    }
});

export default withStyles(useStyles)(CompiledElement)