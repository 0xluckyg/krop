import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { 
    isLoadingReducer, 
    showToastReducer, 
    showAuthorizeModalReducer, 
    getUserReducer,
    showPaymentPlanReducer
} from './reducers';

const reducer = combineReducers({ 
    isLoadingReducer, 
    showToastReducer,
    getUserReducer,
    showAuthorizeModalReducer,
    showPaymentPlanReducer
});

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

export default store;