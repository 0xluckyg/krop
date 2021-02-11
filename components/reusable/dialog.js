import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {
    const {open, handleClose, title, description, yesText, yesAction, noText, noAction} = props

    return (
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
            <div style={{padding: 20}}>
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {
                    noText ? <Button onClick={() => {
                        noAction ? noAction() : null
                        handleClose()
                    }} color="primary">
                        {noText}
                    </Button> :
                    null
                }
                <Button onClick={() => {
                    yesAction ? yesAction() : null
                    handleClose()
                }} style={{color:"white"}} color="primary" variant="contained" autoFocus>
                    {yesText}
                </Button>
            </DialogActions>
            </div>
        </Dialog>
    );
}