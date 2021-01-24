const {User} = require('../db/user');
const jwt = require('jsonwebtoken');
const {createEmailTemplate, sendEmail} = require('../communication/email')

let strings = {
    en:{
        validationEmailHeaderText: "Thanks for signing up ",
        validationEmailBodyText: "Please verify your email address to get access to exclusive materials!",
        validationEmailButtonText: "Verify email now",
        validationEmailSubject: "Please verify your email at krop.app",

        passwordRecoveryEmailHeaderText: "Welcome back, ",
        passwordRecoveryEmailBodyText: "Please follow the link below to reset the password",
        passwordRecoveryEmailButtonText: "Change password",
        passwordRecoveryEmailSubject: "Change your password"
    },
    kr: {
        validationEmailHeaderText: "회원 가입을 해주셔서 감사합니다 ",
        validationEmailBodyText: "이메일을 인증 하시고 프리미엄 기능들을 사용하세요!",
        validationEmailButtonText: "이메일 인증하기",
        validationEmailSubject: "krop.kr 의 이메일을 인증해 주세요",

        passwordRecoveryEmailHeaderText: "안녕하세요, ",
        passwordRecoveryEmailBodyText: "밑에 버튼을 눌러 비밀번호를 바꾸세요!",
        passwordRecoveryEmailButtonText: "비밀번호 바꾸기",
        passwordRecoveryEmailSubject: "비밀번호를 바꿔 주세요"
    }
}
strings = {...strings[process.env.LANGUAGE]}

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
        ctx.session = {accessToken, id: user._id, type: 'organic'}
        console.log("ESSS: ", ctx.session)
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
        
        const existingUser = await User.findOne({email: body.email})
        if (existingUser) {
            ctx.status = 400
            ctx.body = 'user exists'
            return
        }
        
        let user = new User({email: body.email, ...body});
        const accessToken = await user.generateAuthToken()
        ctx.session = {accessToken, id: user._id, type: 'organic'}
        
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
        const {id} = ctx.session        
        await User.findOneAndUpdate(
            { _id: id }, 
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
        const email = body.email
        
        const user = await User.findOne({
            email
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
            headerText: strings.validationEmailHeaderText,
            bodyText: strings.validationEmailBodyText,
            buttonLink: appUrl + '/validate-email?token=' + token + '&email=' + email,
            buttonText: strings.validationEmailButtonText
        })
        
        sendEmail({
            to: body.email,
            subject: strings.validationEmailSubject,
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
        const email = body.email
        
        const user = await User.findOne({
            email
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
            headerText: strings.passwordRecoveryEmailHeaderText,
            bodyText: strings.passwordRecoveryEmailBodyText,
            buttonLink: appUrl + '/authentication/change-pw?token=' + token + '&email=' + email,
            buttonText: strings.passwordRecoveryEmailButtonText
        })
        
        sendEmail({
            to: body.email,
            subject: strings.passwordRecoveryEmailSubject,
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
        const {accessToken, id} = ctx.session
        
        let user;
        if (accessToken) {
            user = await User.findOne({
                _id: id
            });
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            user = await User.findOne({
                _id: decoded._id
            });
        }
        
        if (user && (user.email == email)) {
           user.password = password
           await user.save()
            
            ctx.session = {
                accessToken: user.accessToken,
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