import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LocalizedStrings from 'react-localization';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
let QRCodeStyling = null
if (typeof window !== "undefined") {
    QRCodeStyling = require("qr-code-styling"); 
}
import QRStyleEditor from './qr-style';

import {showToastAction} from '../../../redux/actions';
import keys from '../../../config/keys'
import Selector from '../design/element-editor/sub/selector'

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
        let qr = this.props.state.qr      
        qr = this.recalculateSize(qr)
        this.qrCode = new QRCodeStyling({
            ...qr
        });
        this.state = {
            fileType: 'png'
        }
    }

    recalculateSize(qr) {
        let fixedSize = 320
        qr = {...qr}
        qr.margin = (fixedSize / qr.width) * qr.margin
        qr.width = fixedSize
        qr.height = fixedSize
        return qr
    }

    componentDidMount() {
        this.renderQR()
    }

    getQrValue() {
        const {state} = this.props
        const {domain, path} = state
        const appUrl = process.env.APP_URL.replace("https://", "")
        return `${domain}.${appUrl}/${path}`
    }

    downloadQR() {
        let newQR = new QRCodeStyling({
            ...this.props.state.qr
        });
        newQR.update({
            data: this.getQrValue()
        });
        newQR.download({
            extension: this.state.fileType
        });
    }

    renderQR() {
        this.qrCode.update({
            data: this.getQrValue()
        });
        this.qrCode.append(this.qrRef.current);
    }

    renderFileTypeSelector() {
        return <Selector
            label="Download Type"
            onChange={(value) => {
                this.setState({fileType: value})
            }}
            options={['png', 'jpeg', 'webp']}
            value={this.state.fileType}
        />
    }

    render() {
        const { classes } = this.props;
        return(
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <QRStyleEditor state={this.props.state} setState={(newState) => {
                        this.props.setState(newState)
                        let qr = this.recalculateSize(newState.qr)
                        this.qrCode.update({
                            ...qr
                        })
                    }}/>
                    <div className={classes.qrCodeContainer}>
                        <h2>3. Download QR</h2>
                        <div ref={this.qrRef} />
                        <br/>
                        {this.renderFileTypeSelector()}
                        <Button 
                            // disabled={this.state.isLoading}
                            className={classes.downloadButton} 
                            variant="contained"
                            onClick={() => this.downloadQR()}
                        >
                            Download
                        </Button> 
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
    },
    qrCodeContainer: {
        width: 350,
        paddingLeft: 30
    },
    downloadButton: {
        color: 'white',
        backgroundColor: keys.APP_COLOR
    }
});

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(QREditor));