
const {User} = require('../db/user');
const jwt = require('jsonwebtoken');
const {createEmailTemplate, sendEmail} = require('../communication/email')
async function authenticate(ctx, next) {
    try {
        const {accessToken} = ctx.session
        
        //not authenticated
        if (!accessToken) {
            ctx.redirect('/')
            return
        //has access token
        } else {
            const user = await User.findByToken(accessToken)
            
            //access token not verified
            if (!user) {
                ctx.session = {}
                ctx.redirect('/')
                return
            }
            
            if (!user.verified) {
                ctx.session = {}
                ctx.redirect('/authentication/validate-email?email='+user.email)
                return
            }
            
            await next()
            return
        } 
        
    } catch(err) {
        console.log('Failed authenticate: ', err)
    }
}

async function logIn(ctx) {
    try {
        const {email, password} = ctx.query
        
        let user = await User.findByCredentials(email, password)
        
        const accessToken = await user.generateAuthToken()
        ctx.session = {accessToken, id: user._id, key: user.email, type: 'organic'}
        
        user = user.toObject()
        delete user.password

        ctx.body = {accessToken, ...user}
    } catch(err) {
        ctx.status = 400
        if (err == 'no user') {
            ctx.body = 'no user'
            return
        } else if (err == 'wrong password') {
            ctx.body = 'wrong password'
        }
        console.log("Failed login: ", err)
    }
}

async function signUp(ctx) {
    try {
        let body = JSON.parse(ctx.request.rawBody)
        
        const existingUser = await User.findOne({key: body.email})
        if (existingUser) {
            ctx.status = 400
            ctx.body = 'user exists'
            return
        }
        
        let user = new User({key: body.email, ...body});
        const accessToken = await user.generateAuthToken()
        ctx.session = {accessToken, id: user._id, key: user.email, type: 'organic'}
        
        user = user.toObject()
        delete user.password

        ctx.body = {accessToken, ...user}
    } catch(err) {
        console.log("Failed signup: ", err)
        ctx.status = 400
    }
}

async function logOut(ctx) {
    try {
        const {key} = ctx.session        
        await User.findOneAndUpdate(
            { key }, 
            { $set: { 
                active: false
            } }
        )
        ctx.session = null
        ctx.body = 'logged out'
    } catch (err) {
        console.log('Failed logout: ', err)
    }
}

async function sendValidationEmail(ctx) {
    try {
        //body.name body.email
        const body = JSON.parse(ctx.request.rawBody)
        const key = body.email
        
        const user = await User.findOne({
            email: key
        })
        
        if (!user) {
            ctx.session = {}
            ctx.redirect('/')
            return
        }
        
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET).toString();
        
        const appUrl = process.env.APP_URL
        const validationEmail = await createEmailTemplate({
            headerText: `Thanks for signing up, ${user.name}!`,
            bodyText: 'Please verify your email address to get access to exclusive design and marketing materials!',
            buttonLink: appUrl + '/validate-email?token=' + token + '&email=' + key,
            buttonText: 'Verify Email Now'
        })
        
        sendEmail({
            to: body.email,
            subject: 'Please verify your email at underdog.com',
            html: validationEmail
        })
        
        ctx.body = 'success'

    } catch (err) {
        console.log('Failed send sendValidationEmail email: ', err)
    }
}

async function validateEmail(ctx) {
    try {
        const {token, email} = ctx.query
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded._id
        });
        
        if (user && user.email == email) {
            await User.findOneAndUpdate({_id: user._id}, {verified: true})
            
            ctx.session = {
                accessToken: user.accessToken,
                id: user._id,
                key: user.key,
                type: 'organic'
            }
            
            ctx.redirect('/')
            return
        } else {
            ctx.session = {}
            ctx.redirect('/')
            return
        }
    } catch (err) {
        console.log('Failed validateEmail email: ', err)
    }
}

async function sendPasswordRecoveryEmail(ctx) {
    try {
        //body.name body.email
        const body = JSON.parse(ctx.request.rawBody)
        const key = body.email
        
        const user = await User.findOne({
            email: key
        })
        
        if (!user) {
            ctx.status = 400
            ctx.body = 'no user'
            return
        }
        
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET).toString();
        
        const appUrl = process.env.APP_URL
        const passwordRecoveryEmail = await createEmailTemplate({
            headerText: `Welcome back, ${user.name}!`,
            bodyText: 'Please follow the link below to reset password',
            buttonLink: appUrl + '/authentication/change-pw?token=' + token + '&email=' + key,
            buttonText: 'Change Password'
        })
        
        sendEmail({
            to: body.email,
            subject: 'Change your password',
            html: passwordRecoveryEmail
        })
        
        ctx.body = 'success'

    } catch (err) {
        console.log('Failed send contactUsUnauthorized email: ', err)
    }
}

async function changePassword(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)
        const {token, email, password} = body
        const {accessToken, key} = ctx.session
        
        let user;
        if (accessToken) {
            user = await User.findOne({
                key, accessToken
            });
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            user = await User.findOne({
                _id: decoded._id
            });
        }
        
        if (user && (user.email == email || user.email == key)) {
           user.password = password
           await user.save()
            
            ctx.session = {
                accessToken: user.accessToken,
                key: user.key,
                id: user._id,
                type: 'organic'
            }
            
            ctx.redirect('/')
            return
        } else {
            ctx.redirect('/')
            return
        }
    } catch (err) {
        console.log('Failed validateEmail email: ', err)
    }
}

module.exports = {
    authenticate, 
    logIn, 
    signUp, 
    logOut, 
    sendValidationEmail, 
    validateEmail, 
    sendPasswordRecoveryEmail, 
    changePassword
}