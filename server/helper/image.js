const AWS = require('aws-sdk');
const {authenticateAdmin} = require('../admin')

async function uploadToS3(ctx) {
    try {
        const {id} = ctx.session       
        let body = JSON.parse(ctx.request.rawBody)
        
        let contentType = body.data.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]   
        
        const clean = body.data.replace(/^data:image\/[\w+]+;base64,/, "");
        const imageBase64 = new Buffer(clean, 'base64');
        
        let bucketName = process.env.S3_BUCKET
        let randomKey =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        let resourceName = `${id}-${randomKey}`     
        
        if (await authenticateAdmin(ctx)) {
            bucketName = process.env.S3_BUCKET_ADMIN
        }
    
        const params = {
            Bucket: bucketName,
            Key: resourceName,
            ContentType: contentType,
            ContentEncoding: 'base64',
            Body: imageBase64
        };
        
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });
        
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) return reject(err)
                return resolve(data)
            })
        })
    } catch (err) {
        console.log('Failed upload banner to S3: ', err)
    }
}

async function uploadImage(ctx) {
    try {
        let body = JSON.parse(ctx.request.rawBody)
        
        if (!body.data) return 
        
        const s3Res = await uploadToS3(ctx)
        ctx.body = s3Res.Location
    } catch (err) {
        console.log('Failed createPreviewHeader: ', err)
        ctx.status = 500
    }
}

module.exports = {uploadImage}