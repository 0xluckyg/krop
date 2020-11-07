import keys from '../config/keys';

//Reducer that shows the status of the toast after user saves
export const showToastReducer = (state = {show:false, text:'', type: 'success'}, action) => {
    switch (action.type) {
        case keys.SHOW_TOAST:
            state = action.payload
            return state;        
        default:            
            return state;
    }
}

//Reducer that shows the status of the loading screen
export const isLoadingReducer = (state = false, action) => {    
    switch (action.type) {
        case keys.IS_LOADING:
            state = action.payload
            return state;        
        default:            
            return state;
    }
}

//Reducer that shows users the payment plans
export const showPaymentPlanReducer = (state = false, action) => {    
    switch (action.type) {
        case keys.SHOW_PAYMENT_PLAN:
            state = action.payload
            return state;        
        default:            
            return state;
    }
}

export const getUserReducer = (state = {}, action) => {
    switch(action.type) {
        case keys.GET_USER:
            state = action.payload
            return state;
        default:
            return state;
    }
}

export const showAuthorizeModalReducer = (state = false, action) => {    
    switch (action.type) {
        case keys.SHOW_AUTHORIZE_MODAL:
            state = action.payload
            return state;        
        default:            
            return state;
    }
}