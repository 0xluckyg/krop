if (process.env.NODE_ENV != 'production') {
    require('dotenv').config({path: __dirname + '/.env'})
}
require('./config/config');
require('./server/db/mongoose');

//koa and koa-session will take care of Shopify OAuth
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const session = require('koa-session');
const next = require('next');
const compression = require('compression')
const koaConnect = require('koa-connect');

const { SHOPIFY_API_SECRET_KEY } = process.env;
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
//app refers to the Next.js app, which is the react build
const app = next({ dev });
const handle = app.getRequestHandler();

const {getUser, updateUser} = require('./server/helper/user');
const {
    authenticate, 
    signUp, 
    logIn, 
    logOut, 
    validateEmail, 
    sendValidationEmail, 
    sendPasswordRecoveryEmail, 
    changePassword
} = require('./server/auth/auth');
const {contactUs, contactUsUnauthorized} = require('./server/helper/contact-us');
const {googleAuth} = require('./server/auth/google-auth');
const {uploadImage} = require('./server/helper/image')
const {getMediaTemplates, getPexelsTemplates} = require('./server/admin/templates')
const {createCampaign, getCampaigns, getCampaign, updateCampaign, deleteCampaign} = require('./server/campaign/manage');
const {createBanner, getBanners, getBanner, updateBanner, deleteBanner} = require('./server/banner/manage');
const {createBannerOrders, getBannerOrders, updateBannerOrder, deleteBannerOrder} = require('./server/banner/order');
const {getCampaignScript, getCampaignOptions} = require('./server/campaign/serve');
const {receiveCampaign} = require('./server/campaign/receive');

const {getProfiles, removeProfile} = require('./server/responses/profiles');
const {getCampaignSessions} = require('./server/responses/sessions');
const {getCampaignResponses, deleteCampaignResponse} = require('./server/responses/responses');
const {createReferralCoupon} = require('./server/referral');

const whitelist = [    
    '/_next',
    '/static',
    '/settings/privacy-policy',
    '/settings/terms-of-service',
    '/settings/contact-us',
    '/authentication/validate-email',
    '/authentication/pw-recovery',
    '/authentication/change-pw'
]
async function handleRender(ctx) {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return
}

async function cors(ctx, next) {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-No-CORS-Reason, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    ctx.set('Access-Control-Allow-Credentials', true);
    await next();
}

//Prepare next.js react app
app.prepare().then(() => {

    //Koa acts like "app" in express
    const server = new Koa();    
    const router = new Router();
    server.keys = [process.env.APP_SECRET];    
    server.use(koaConnect(compression()))
    server.use(cors);
    server.use(bodyParser({jsonLimit:'5mb', textLimit:'5mb'}));   
    
    server.use(session({
        //30 days in miliseconds
        maxAge: 1000 * 60 * 60 * 24 * 30,
        renew: true        
    }, server));
    
    const routerUnauthorized = new Router();
    server.use(routerUnauthorized.routes());

    routerUnauthorized.get('/:path', getCampaignScript)
    routerUnauthorized.post('/campaign-options', getCampaignOptions);
    routerUnauthorized.post('/campaign-receive', receiveCampaign);
    // routerUnauthorized.post('/campaign-validate', validateCampaignResponse);
    
    routerUnauthorized.get('/log-in', logIn)
    routerUnauthorized.post('/sign-up', signUp)
    routerUnauthorized.post('/send-validation-email', sendValidationEmail);
    routerUnauthorized.post('/send-pw-recovery-email', sendPasswordRecoveryEmail);
    routerUnauthorized.post('/change-pw', changePassword);
    routerUnauthorized.post('/contact-us-unauthorized', contactUsUnauthorized)

    // Allows routes that do not require authentication to be handled
    server.use(async (ctx, next) => {
        let noAuth = false
        for (let i in whitelist) {
            if (ctx.request.url.startsWith(whitelist[i])) noAuth = true;
        }

        if (ctx.request.url == '/') {
            if (ctx.session.accessToken) {
                return ctx.redirect('/home')
            } else {
                noAuth = true
            }
        }
        
        if (ctx.request.url.startsWith('/validate-email')) {
            return validateEmail(ctx)
        }
        
        if (noAuth) {
            return handleRender(ctx)
        } else {
            await next()
        }
    });    

    server.use(router.routes());

    server.use(authenticate)
 
    router.get('/google-auth', googleAuth);
    router.post('/log-out', logOut)
    
    router.get('/get-user', getUser);       
    router.post('/update-user', updateUser)
    
    router.post('/contact-us', contactUs);        
    
    router.post('/create-campaign', createCampaign);
    router.put('/update-campaign', updateCampaign);
    router.post('/delete-campaign', deleteCampaign);
    router.get('/get-campaigns', getCampaigns);
    router.get('/get-campaign', getCampaign);

    router.post('/create-banner', createBanner);
    router.put('/update-banner', updateBanner);
    router.post('/delete-banner', deleteBanner);
    router.get('/get-banners', getBanners);
    router.get('/get-banner', getBanner);
    
    router.post('/upload-image', uploadImage);
    router.get('/get-media-templates', getMediaTemplates)
    router.get('/get-pexels-templates', getPexelsTemplates)

    router.get('/get-profiles', getProfiles)
    router.get('/get-sessions', getCampaignSessions)
    router.get('/get-responses', getCampaignResponses)
    router.post('/remove-profile', removeProfile)

    router.post('/create-referral-coupon', createReferralCoupon)

    router.post('/create-banner-orders', createBannerOrders)
    router.get('/get-banner-orders', getBannerOrders)
    router.put('/update-banner-order', updateBannerOrder)
    router.post('/delete-banner-order', deleteBannerOrder)

    server.use(handleRender);    

    server.listen(port, () => {
        console.log(`Running on port: ${port}`);
    });
});