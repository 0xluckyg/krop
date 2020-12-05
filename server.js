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
const {createSurvey, getSurveys, getSurvey, updateSurvey, deleteSurvey} = require('./server/survey/manage');
const {getSurveyScript, getSurveyOptions} = require('./server/survey/serve');

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
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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
    
    routerUnauthorized.get('/dev', getSurveyScript);
    routerUnauthorized.post('/survey-options', getSurveyOptions);
    // routerUnauthorized.post('/survey-response', saveSurveyResponse);
    // routerUnauthorized.post('/survey-validate', validateSurveyResponse);
    
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
    
    router.post('/create-survey', createSurvey);
    router.put('/update-survey', updateSurvey);
    router.post('/delete-survey', deleteSurvey);
    router.get('/get-surveys', getSurveys);
    router.get('/get-survey', getSurvey);
    
    router.post('/upload-image', uploadImage);
    router.get('/get-media-templates', getMediaTemplates)
    router.get('/get-pexels-templates', getPexelsTemplates)

    server.use(handleRender);    

    server.listen(port, () => {
        console.log(`Running on port: ${port}`);
    });
});