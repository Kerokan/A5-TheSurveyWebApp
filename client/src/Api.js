async function logIn(credentials) {
    console.log(credentials)
    let response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    });
    if(response.ok){
        const user = await response.json();
        return user.username;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
          }
          catch(err) {
            throw err;
          }
    }
}

async function logOut() {
    await fetch('/current', {method: 'DELETE'});
}

async function getUserInfo() {
    const response = await fetch('/current');
    const userInfo = await response.json();
    if(response.ok) {
        return userInfo;
    } else {
        throw userInfo;
    }
}

async function getAllSurvey() {
    const response = await fetch('/survey');
    const surveyList = await response.json();
    if(response.ok) {
        return surveyList;
    } else {
        throw surveyList;
    }
}

async function getSurveyById(id) {
    const response = await fetch('/survey/' + id);
    const survey = await response.json();
    if(response.ok) {
        return survey;
    } else {
        throw survey;
    }
}

async function getQuestionList(id) {
    const response = await fetch('/questions/' + id);
    const questions = await response.json();
    if(response.ok) {
        return questions;
    } else {
        throw questions;
    }
}

async function getAnswersList(id) {
    const response = await fetch('/answers/' + id);
    const answers = await response.json();
    if(response.ok) {
        return answers;
    } else {
        throw answers
    }
}

async function sendResponse(answer) {
    await fetch('/response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answer)
    });
}

async function getAuthor(id) {
    const response = await fetch('/author/' + id);
    const author = await response.json();
    if(response.ok) {
        return author;
    } else {
        throw author;
    }
}

async function getNumberResponses(id) {
    const response = await fetch('/numberResponses/' + id);
    const number = await response.json();
    if(response.ok) {
        return number;
    } else {
        throw number;
    }
}

async function getSurveyPublied() {
    const response = await fetch('/publied');
    const surveys = await response.json();
    if(response.ok) {
        return surveys
    } else {
        throw surveys
    }
}

async function getResponseList(surveyId) {
    const response = await fetch('/responseList/' + surveyId);
    const responses = await response.json();
    if(response.ok) {
        return responses
    } else {
        throw responses
    }
}

async function getResponseById(id) {
    const response = await fetch('/response/' + id);
    const responseDB = await response.json();
    if(response.ok) {
        return responseDB
    } else {
        throw responseDB
    }
}

const API = {logIn, logOut, getUserInfo, getAllSurvey, getSurveyById,
       getQuestionList, getAnswersList, sendResponse, getAuthor, getNumberResponses,
        getSurveyPublied, getResponseList, getResponseById};
export default API;