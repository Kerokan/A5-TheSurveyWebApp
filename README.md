# Exam #1: "Survey"
## Student: s286615 CAM MARTIN

## React Client Application Routes

- Route `/`: Main page - Display all the surveys available (+ a header and a sidebar).
- Route `/login`: LogIn page - Allow a user to log in. If already logged in, it redirect to `/`.
- Route `/survey/:surveyId`: Answer to a Survey page - Allow a user to answer to the survey identified by the param. The param must be a number that identifies a survey.
- Route `/mySurveys`: User's Surveys page - Display all the surveys published by the user (+ a header and a sidebar).
- Route `/check-survey/:surveyId`: All answers to a Survey page - Display all the answers to the survey identified by the param. The param must be a number that identifies a survey published by the logged in user.

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `users` - contains usersId, login, password - Used for the LogIn and the identification of the users
- Table `survey` - contains surveyId, title, userId - Used to store the title and the author of the user
- Table `questions` - contains questionId, surveyId, title, open, mandatory - Used to store the title of the question, its ID, the survey it comes from, and the rules applied to it.
- Table `answers` - contains questionId, min, max, options - Used to store the different options of a CLOSED question (there is no answers element for OPEN questions), and the min and max answers you can check.
- Table `resposnes` - contains sId, username, questionId, content - Used to store the answers to a survey. sId is the same for all the answers, allowing a user to answer 2 times to the same survey. Content is a JSON containing the answer to the question.

## Main React Components

- `Main` (in `App.js`): Display the list of all surveys and a link to answer them
- `SurveyAnswer` (in `App.js`): Display all the questions and allow a user to complete them, then check the validity and submit the survey
- `SurveyPublied` (in `App.js`): Display all the surveys publied by the user logged in and a link to check the answers
- `AllResponseCheck` (in `App.js`): Display the answers of the users one at a time. Allow switching between answers with arrows.

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- JohnTheAdmin, password 
- NickTheBetterAdmin, betterPassword
