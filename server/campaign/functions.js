const {CampaignQuestion} = require('../db/campaign-question');

async function saveCampaignQuestions(campaignOptions) {
    const {stages, accountId, campaignId, campaignName} = campaignOptions
    let campaigns = []
    
    stages.map(stage => {
        stage.elements.map(element => {
            let {id, type, question, options} = element
            let cleanOptions = []
            options ? options.map(o => cleanOptions.push(o)) : null
            
            let campaignQuestion = {
                accountId,
                campaignId,
                questionId: id,  
                campaignName,
                
                type,
                question,
                options: cleanOptions
            }
            
            campaigns.push(campaignQuestion)
        })
    })
    
    try {
        await CampaignQuestion.insertMany(campaigns, {ordered: false})
    } catch(e) {
        console.log("Failed saveCampaignQuestions", e)
    }
}

async function removeCampaignQuestions(campaignOptions) {
    try {
        const {campaignId} = campaignOptions
        await CampaignQuestion.deleteMany({campaignId})   
    } catch(e) {
        console.log("Failed removeCampaignQuestions")
    }
}

async function updateCampaignQuestions(campaignOptions) {
    await removeCampaignQuestions(campaignOptions)
    return await saveCampaignQuestions(campaignOptions)
}

module.exports = {
    saveCampaignQuestions, removeCampaignQuestions, updateCampaignQuestions
}