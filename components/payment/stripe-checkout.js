import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js';

async function requestStripePayment(plan, errorHandler) {
    try {
        return await axios.get(process.env.APP_URL + '/handle-stripe-subscription', {
            params: { plan },
            withCredentials: true
        })
    } catch (err) {
        return errorHandler(err)
    }
}

async function handleStripeCheckout(id, errorHandler) {
    const stripePromise = loadStripe(process.env.STRIPE_API_KEY);
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
        sessionId: id
    });
    if (error) return errorHandler(error)
}

async function handleStripePayment(plan, errorHandler) {
    try {
        const stripeSession = await requestStripePayment(plan, errorHandler);
        
        //if return value is updated, it means user is not new to payment
        if (stripeSession.data != 'updated') {
            await handleStripeCheckout(stripeSession.data.id, errorHandler)   
        }
    } catch(err) {
        errorHandler(err)
    }
};

module.exports = {
    handleStripePayment
}