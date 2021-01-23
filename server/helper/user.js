const {User} = require('../db/user');

async function getUser(ctx) {
    const accessToken = ctx.session.accessToken
    if (accessToken) {
        try {
            const user = await User.findOne({accessToken}, {password: 0})
            if (!user) {
                ctx.status = 400
                return
            }
            delete user.accessToken
            ctx.body = user
        } catch (err) {
            console.log('Failed getUser: ', err)
            ctx.status = 400
        }
    } else {
        ctx.status = 400
    }
}

async function updateUser(ctx) {
    const body = JSON.parse(ctx.request.rawBody)
    const {_id, name, email, domain, primaryColor, secondaryColor, integrations} = body
    let params = {}
    name ? params.name = name : null
    email ? params.email = email : null
    domain ? params.domain = domain : null
    primaryColor ? params.primaryColor = primaryColor : null
    secondaryColor ? params.secondaryColor = secondaryColor : null
    integrations ? params.integrations = integrations : null
    
    let newUser = await User.findByIdAndUpdate(_id, params, {new: true})
    newUser = newUser.toObject()
    delete newUser.password
    delete newUser.accessToken
    ctx.body = newUser
}

module.exports = {getUser, updateUser}