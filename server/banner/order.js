const {Order} = require('../db/order');

async function createBannerOrders(ctx) {
    let body = JSON.parse(ctx.request.rawBody)
    let orders = body.orders

    let orderObjects = []
    Object.keys(orders).map(key => {
        let orderObject = {}
        let order = orders[key]
        orderObject.bannerId = key
        orderObject.accountId = order.banner.accountId,
        orderObject.count = order.count
        orderObjects.push(orderObject)
    })

    await Order.insertMany(orderObjects, {ordered: false})

    ctx.status = 200
}

async function updateBannerOrder(ctx) {
    try {
        let body = JSON.parse(ctx.request.rawBody)
        if (body.compile != false) {
            body.compiled = {...await getCompiledOrder(body)}   
        }
        const newOrder = await Order.findByIdAndUpdate(body._id, {...body}, {new: true})
        ctx.body = newOrder
    } catch (err) {
        console.log('Failed updateOrder: ', err)
        ctx.status = 500
    }
}

async function getBannerOrder(ctx) {
    try {
        const order = await Order.findById(ctx.query._id)
        ctx.body = order
    } catch (err) {
        console.log('Failed getOrders: ', err)
        ctx.status = 400
    }       
}

async function getBannerOrders(ctx) {
    try {        
        const limit = 30
        const id = ctx.session.id
        let page = parseInt(ctx.query.page)
        let hasPrevious = true; let hasNext = true

        const total = await Order.countDocuments({accountId: id, expiresAt: null})
        const totalPages = Math.ceil(total / limit)
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false
        
        const orders = await Order.find({accountId: id, expiresAt: null})
        .sort({from: -1})
        .skip((page * limit) - limit)
        .limit(limit)
        
        ctx.body = {orders, page, hasPrevious, hasNext, totalPages, total}
    } catch (err) {
        console.log('Failed getOrders: ', err)
        ctx.status = 400
    }       
}

async function deleteBannerOrder(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)      
        const _id = body._id
        await Order.findByIdAndRemove(_id)
        ctx.body = 200
    } catch (err) {
        console.log('Failed deleteOrder: ', err)
        ctx.status = 500
    }
}


module.exports = {
    createBannerOrders,
    getBannerOrders,
    getBannerOrder,
    updateBannerOrder,
    deleteBannerOrder
}