import axios from 'axios';

import keys from '../config/keys';

//Action that shows the status of the toast after user saves
export const showToastAction = (show, text, type) => {    
    if (!text) text = ''
    if (!type) type = 'success'
    return {
        type: keys.SHOW_TOAST,
        payload: {show, text, type}
    }
}

//Action that shows the status of the loading screen
export const isLoadingAction = (isLoading) => {        
    return {
        type: keys.IS_LOADING,
        payload: isLoading
    }
}

//Thunk middleware and action for getting user from the server
export const getUserAction = () => {
    return dispatch => {
        console.log(process.env.APP_URL + '/get-user')
        axios.get(process.env.APP_URL + '/get-user')
        .then(res => {            
            dispatch(getUserResolveAction(res.data))            
        }).catch(err => {
            console.log('Failed getting user: ',err)
        })
    }
}

export const getUserResolveAction = (user) => {
    return {
        type: keys.GET_USER,
        payload: user
    }
}

//Whether to show payment plan modal on the app
export const showPaymentPlanAction = (show, text) => {
    return {
        type: keys.SHOW_PAYMENT_PLAN,
        payload: {show, text}
    }
}

//Action that shows the status of the toast after user saves
export const showAuthorizeModalAction = (show) => {
    return {
        type: keys.SHOW_AUTHORIZE_MODAL,
        payload: show
    }
}