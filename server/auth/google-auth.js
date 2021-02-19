// https://github.com/googleapis/google-api-nodejs-client/blob/c00d1892fe70d7ebf934bcebe3e8a5036c62440c/README.md#manually-refreshing-access-token
const {OAuth2Client} = require('google-auth-library');
const {User} = require('../db/user');
const shortid = require('shortid')

/*************/
/** HELPERS **/
/*************/

function createConnection() {
    return  new OAuth2Client(
        process.env.GOOGLE_API_CLIENT_ID,
        process.env.GOOGLE_API_CLIENT_SECRET,
        process.env.APP_URL
    );
}

async function saveUser(ctx, info) {
    const {name, email, accessToken} = info
    let user = await User.findOne({email})
    if (user) {
        user = await User.findOneAndUpdate({email}, {
            $set: {
                type: 'google',
                active: true,
                accessToken,
                verified: true
            }
        }, {new: true})   
        ctx.session = {
            type: 'google', accessToken, id: user._id,
        }
    } else {
        
        user = new User({
            type: 'google',
            name,
            email,
            domain: shortid.generate(),
            accessToken,
            active: true,
            verified: true,
        })
        await user.save()
        ctx.session = {
            type: 'google', accessToken, id: user._id,
        }
    }
    
    user = user.toObject()
    delete user.password

    return user
}

/*************/
/** MAIN **/
/*************/

async function googleAuth(ctx) {
    try {
        const code = ctx.query.code
        const oauth2Client = createConnection()
        const {tokens} = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(tokens);
        const url = 'https://people.googleapis.com/v1/people/me?personFields=names';
        const res = await oauth2Client.request({url});
        let name = res.data.names[0]
        name = name ? name.unstructuredName : ''
        
        const tokenInfo = await oauth2Client.getTokenInfo(
            oauth2Client.credentials.access_token
        );
        const email = tokenInfo.email
        const user = await saveUser(ctx, {
            email,
            name,
            domain: shortid.generate(),
            accessToken: tokens.refresh_token
        })
        ctx.body = user
    } catch (err) {
        ctx.status = 500
        console.log('Failed get google tokens: ', err)
    }
}

module.exports = {createConnection, googleAuth};