const {User} = require('../db/user');

async function authenticateAdmin(ctx) {
    const {accessToken} = ctx.session
    
    const user = await User.findOne({accessToken})
    if (user.email == process.env.APP_EMAIL) {
        return true
    } else {
        return false
    }
}

module.exports = {
    authenticateAdmin
}