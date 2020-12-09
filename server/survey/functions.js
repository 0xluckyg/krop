const {SurveyQuestion} = require('../../db/survey-questions');

async function saveSurveyQuestions(surveyOptions) {
    const {stages, accountId, surveyId, surveyName} = surveyOptions
    let surveys = []
    stages.map(stage => {
        stage.elements.map(element => {
            let {id, type, question, options} = element
            let cleanOptions = []
            options ? options.map(o => cleanOptions.push(o)) : null
            
            let surveyQuestion = {
                accountId,
                surveyId,
                questionId: id,  
                surveyName,
                
                type,
                question,
                options: cleanOptions
            }
            
            surveys.push(surveyQuestion)
        })
    })
    
    try {
        await SurveyQuestion.insertMany(surveys, {ordered: false})
    } catch(e) {
        console.log("Failed saveSurveyQuestions", e)
    }
}

async function removeSurveyQuestions(surveyOptions) {
    try {
        const {campaignId} = surveyOptions
        await SurveyQuestion.deleteMany({campaignId})   
    } catch(e) {
        console.log("Failed removeSurveyQuestions")
    }
}

async function updateSurveyQuestions(surveyOptions) {
    await removeSurveyQuestions(surveyOptions)
    return await saveSurveyQuestions(surveyOptions)
}

module.exports = {
    saveSurveyQuestions, removeSurveyQuestions, updateSurveyQuestions
}