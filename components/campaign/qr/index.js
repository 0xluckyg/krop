import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LocalizedStrings from 'react-localization';

import { withStyles } from '@material-ui/core/styles';
let QRCodeStyling = null
if (typeof window !== "undefined") {
    QRCodeStyling = require("qr-code-styling"); 
}
import QRStyleEditor from './qr-style';

import {showToastAction} from '../../../redux/actions';
import keys from '../../../config/keys'

let strings = new LocalizedStrings({
    us:{

    },
    kr: {

    }
});
strings.setLanguage(process.env.LANGUAGE ? process.env.LANGUAGE : 'us')

//A pop up to ask users to login or signup
class QREditor extends React.Component {
    constructor(props){
        super(props)
        this.qrRef = React.createRef();
    }

    componentDidMount() {
        this.renderQR()
    }

    renderQR() {
        let qr = this.props.state.qr      
        const qrCode = new QRCodeStyling({
            ...qr
        });
        qrCode.update({
            data: 'www.facebook.com'
        });
        qrCode.append(this.qrRef.current);
    }

    render() {
        const { classes } = this.props;
        return(
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <QRStyleEditor/>
                    <div className={classes.qrCodeContainer}>
                        <div ref={this.qrRef} />
                    </div>
                </div>
            </div>            
        )
    }
}

const useStyles = theme => ({
    content: {
        flexGrow: 1,
        paddingBottom: theme.spacing(3),
        marginLeft: -keys.NAV_WIDTH,
        [theme.breakpoints.up('sm')]: {
			marginLeft: 0,
		},
    },
    wrapper: {
        height: "calc(100vh - 48px)",
        display: 'flex',
        flexDirection: 'row',
        padding: theme.spacing(3, 5),
    }
});

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(QREditor));