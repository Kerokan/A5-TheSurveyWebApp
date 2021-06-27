import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Modal, ModalBody } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Redirect,
  NavLink
} from 'react-router-dom';

import API from './Api.js';

//App
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.getUserInfo();
        setLoggedIn(true);
      } catch (err) {
        console.log(err);
      }
    };
    checkAuth();
  }, []);

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
    } catch (err) {
      console.log(err);
    }
  }

  const doLogOut = async () => {
    try {
      await API.logOut();
      setLoggedIn(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">

      <Router>
        <Header loggedIn={loggedIn} logout={doLogOut} />
        <Switch>
          <Route exact path="/" children={<Main logout={doLogOut} />} />
          <Route exact path="/login" render={() =>
            <>{loggedIn ? <Redirect to="/" /> : <LogIn login={doLogIn} />} </>} />
          <Route path="/survey/:surveyId" children={<SurveyAnswer />} />
          <Route path="/mySurveys" render={() =>
            <>{loggedIn ? < SurveyPublied /> : <LogIn login={doLogIn} />} </>} />
          <Route path="/check-survey/:surveyId" render={() =>
            <>{loggedIn ? <AllResponseCheck /> : <LogIn login={doLogIn} />} </>} />
          <Route path="/new" render={() =>
            <> {loggedIn ? <NewSurvey /> : <LogIn login={doLogIn} />} </>} />
        </Switch>
      </Router>

      <script src="https://unpkg.com/react/umd/react.production.min.js" crossOrigin="true"></script>
      <script
        src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
        crossOrigin="true"></script>
      <script
        src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js"
        crossOrigin="true"></script>
    </div>
  );
}

//Header
function Header(props) {
  const [show, setShow] = useState(false);
  const [goToLogIn, setGoToLogIn] = useState(false);
  const [goToHome, setGoToHome] = useState(false);

  useEffect(() => {
    setGoToLogIn(false);
    setGoToHome(false);
  }, [goToHome, goToLogIn]);

  const handleLogOut = async () => {
    props.logout().then(() => {
      setShow(false);
      setGoToHome(true);
    });
  };
  const handleShow = () => {
    if (props.loggedIn) {
      setShow(true);
    } else {
      setGoToLogIn(true);
    }
  }
  const handleHome = () => {
    setGoToHome(true);
  }

  return (
    <header>
      {goToLogIn ? <Redirect to='/login' /> : ''}
      {goToHome ? <Redirect to='/' /> : ''}
      <Modal show={show} onHide={() => setShow(false)} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to log out ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button className='form-control bg-danger' onClick={handleLogOut}>Yes</Button>
          <Button className='form-control bg-secondary' onClick={() => setShow(false)}>No</Button>
        </Modal.Body>

      </Modal>
      <nav className="navbar bg-primary justify-content-between">
        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="#FFFFFF" className="bi bi-house clickable" viewBox="0 0 16 16" onClick={handleHome}>
          <path fillRule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z" />
          <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z" />
        </svg>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="#FFFFFF" className="bi bi-question-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
          </svg>
          <strong className='text-light'> The Survey</strong>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="#FFFFFF" className="bi bi-person-circle clickable" viewBox="0 0 16 16" onClick={handleShow}>
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
        </svg>
      </nav>
    </header>
  );
}

//Log In Page
function LogIn(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const credentials = { username, password };

    let valid = true
    if (username === '' || password === '') {
      valid = false;
    }

    if (valid) {
      props.login(credentials);

    }
  };

  return (
    <Row>
      <div className='col-3' />
      <Form className='col-6 mt-3' onSubmit={handleSubmit}>
        <Form.Group controlId='username'>
          <Form.Label> Username </Form.Label>
          <Form.Control value={username} onChange={ev => setUsername(ev.target.value)} />
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label> Password </Form.Label>
          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
        </Form.Group>
        <Button variant='primary' type='submit'>Log In</Button>
      </Form>
      <div className='col-3' />
    </Row>
  );
}

//Main part --> SideBar + SurveyDisplay/Survey
function Main(props) {
  const [surveyList, setSurveyList] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSurvey = async () => {
      const survey = await API.getAllSurvey();
      setSurveyList(survey);
    }

    getSurvey();
  }, []);

  return (
    <div className='row col-12'>
      <SideBar />
      <main className='col-9'>
        {surveyList.length !== 0 ?
          <ul> {surveyList.map(s => <SurveyDisplay survey={s} />)} </ul> : <p> There is no survey uploaded yet </p>
        }
      </main>
    </div>
  )
}

// SideBar
function SideBar(props) {
  return (
    <aside className='col-md-2 d-none d-md-block mt-3 ml-3'>
      <nav className="nav flex-column sidebar">
        <NavLink to='/' className='nav-link'>All Surveys</NavLink>
        <NavLink to='/mySurveys' className='nav-link'>My Survey</NavLink>
      </nav>
    </aside>
  );
}

// Information of a Survey --> Title + Author + Number of answers + Link to answer it
function SurveyDisplay(props) {
  const [redirect, setRedirect] = useState(false);
  const [author, setAuthor] = useState("");
  const [NResponses, setNResponses] = useState(0);

  const handleClick = () => {
    setRedirect(true);
  };

  useEffect(() => {
    const getInfo = async () => {
      const authorDB = await API.getAuthor(props.survey.surveyId);
      const nResponsesDB = await API.getNumberResponses(props.survey.surveyId);
      setAuthor(authorDB[0].name);
      setNResponses(nResponsesDB[0].total);
    }

    getInfo();
  }, []);

  return (
    <li className='row col justify-content-between border border-primary rounded mt-2'>
      {redirect ? <Redirect to={"/survey/" + props.survey.surveyId} /> : ""}
      <div className='col-8' align='left'>
        <h3>{props.survey.title}</h3>
        <ul className='list-unstyled ml-5'>
          <li> Posted by {author} </li>
          <li> Already answered by {NResponses} people</li>
        </ul>
      </div>
      <div className='col-4' align='right'>
        <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" fill="#0275D8" className="bi bi-play" viewBox="0 0 16 16" onClick={handleClick}>
          <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
        </svg>
      </div>

    </li>
  );
}

// Form to answer a Survey --> Title + Username + OpenQuestionDisplay/Open question + ClosedQuestionDisplay/Closed question + Check validity + Submit button
function SurveyAnswer(props) {
  const surveyId = useParams().surveyId;
  const [questionList, setQuestionList] = useState([]);
  const [surveyInfo, setSurveyInfo] = useState([]);
  const [validN, setValidN] = useState(0);
  const [username, setUsername] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let openI = 0;
    let closedI = 0;
    questionList.forEach(async (q) => {
      if (q.open) {
        if (event.target.openQuestion.length === undefined) {
          const responseJSON = {
            username: username,
            questionId: q.questionId,
            content: event.target.openQuestion.value
          };
          await API.sendResponse(responseJSON);
        } else {
          const responseJSON = {
            username: username,
            questionId: q.questionId,
            content: event.target.openQuestion[openI].value
          };
          await API.sendResponse(responseJSON);
          openI = openI + 1;
        }
      } else {
        if(event.target.closedQuestion === undefined) {
          const responseJSON = {
            username: username,
            questionId: q.questionId,
            content: '[]'
          };
          await API.sendResponse(responseJSON);
        }
        if (event.target.closedQuestion.length === undefined) {
          const responseJSON = {
            username: username,
            questionId: q.questionId,
            content: event.target.closedQuestion.value
          };
          await API.sendResponse(responseJSON);
        } else {
          const answers = await API.getAnswersList(q.questionId);
          const options = JSON.parse(answers[0].options);
          let content = "[";
          let tempClosedI = closedI;
          options.forEach(a => {
            content = content + event.target.closedQuestion[closedI].checked;
            if (tempClosedI - 1 == closedI - options.length) {
              content = content + "]";
            } else {
              content = content + ", ";
            }
            closedI = closedI + 1;
          })
          const responseJSON = {
            username: username,
            questionId: q.questionId,
            content: content
          }
          API.sendResponse(responseJSON)
        }
      }
    });
    setIsSubmitted(true);
  };

  useEffect(() => {
    const getSurveyId = async () => {
      const survey = await API.getSurveyById(surveyId);
      setSurveyInfo(survey);
    }
    getSurveyId();
  }, [surveyId]);

  useEffect(() => {
    const getQuestion = async () => {
      const questions = await API.getQuestionList(surveyId);
      setQuestionList(questions);
      questions.map(q => {
        if (!q.mandatory) {
          setValidN(v => v + 1);
        }
      });
    }
    getQuestion();
  }, [surveyId]);

  return (
    <div className='row'>
      {surveyInfo.length === 0 ?
        <div className='col'>
          <form className='form-group'>
            <p>This survey does not exist or its info are not retrieved..</p>
          </form>
        </div>
        :
        <>
          {isSubmitted ? <Redirect to='/' /> : ""}
          <div className='col-1' />
          <div className='col-10'>
            <form className='form-group' onSubmit={handleSubmit}>
              {surveyInfo.length !== 0 ? <h2>{surveyInfo[0].title}</h2> : <p>No Survey Info</p>}
              <div className='form-group row mt-4 mb-4'>
                <label className='col-4' htmlFor={"username"}>Choose a username :</label>
                <input type='text' className='form-control col-7' id='username' value={username} onChange={ev => setUsername(ev.target.value)} />
              </div>
              {questionList.length !== 0 ? questionList.map(q =>
                q.open ? <OpenQuestionDisplay key={q.questionId} question={q} validN={validN} setValidN={setValidN} /> : <ClosedQuestionDisplay key={q.questionId} question={q} validN={validN} setValidN={setValidN} />)
                : <p>There is no questions registered in this survey..</p>}
              {username.length === 0 ? <p className='text-danger'> You have to choose a username !</p> : ""}
              {validN !== questionList.length ? <p className='text-danger'> Some answers are not valid !</p> : ""}
              {(validN === questionList.length) && (username.length !== 0) ? <Button variant='primary' type='submit'>Submit the Survey</Button> : <Button variant='secondary' disabled>You can't submit right now</Button>}
            </form>
          </div>
        </>}
    </div>
  );
}

// Display an open question --> Title + TextArea + Check validity
function OpenQuestionDisplay(props) {
  const [answer, setAnswer] = useState("");
  const [sizeRemaining, setSizeRemaining] = useState(200);
  const [isValid, setIsValid] = useState(true);
  const [modified, setModified] = useState(false);

  useEffect(() => {
    if (props.question.mandatory === 1) {
      setIsValid(false);
    }
  }, [])

  useEffect(() => {
    setSizeRemaining(200 - answer.length);
  }, [answer]);

  //TODO : Check that !
  useEffect(() => {
    if (isValid && answer.length === 0 && modified && props.question.mandatory === 1) {
      setIsValid(false);
      props.setValidN(props.validN - 1);
    }
    setModified(true);
    if (isValid && sizeRemaining < 0) {
      setIsValid(false);
      props.setValidN(props.validN - 1);
    } else {
      if (!isValid && sizeRemaining >= 0) {
        setIsValid(true);
        props.setValidN(props.validN + 1);
      }
    }
  }, [sizeRemaining]);

  return (
    <div className='row form-group mb-4 mt-4'>
      <label className='form-control' htmlFor={"openQuestion"}>{props.question.title}</label>
      <div className='col' align='left'>
        {props.question.mandatory ? <small className='form-text text-danger'> This question is mandatory.</small> : ""}
        {sizeRemaining >= 0 ? <small className='form-text text-muted'>You have {sizeRemaining} characters left.</small>
          : <small className='form-text text-danger'>You exceeded the size of the answer by {0 - sizeRemaining} characters.</small>}
        <textarea className="form-control" id={"openQuestion"} rows="3" value={answer} onChange={ev => setAnswer(ev.target.value)}></textarea>
      </div>
    </div>
  );
}

// Display a closed question --> Title + AnswerDisplay/Answer + Check validity
function ClosedQuestionDisplay(props) {
  const [answersList, setAnswersList] = useState([]);
  const [answersMin, setanswersMin] = useState(0);
  const [answersMax, setanswersMax] = useState(100);
  const [answeredN, setAnsweredN] = useState(0);
  const [isValid, setIsValid] = useState(true);
  const questionId = props.question.questionId;

  useEffect(() => {
    if (props.question.mandatory === 1) {
      setIsValid(false);
    }
  }, [])

  useEffect(() => {
    const getAnswers = async () => {
      const answers = await API.getAnswersList(questionId)
      setAnswersList(JSON.parse(answers[0].options));
      setanswersMin(answers[0].min);
      setanswersMax(answers[0].max);
    };
    getAnswers();
  }, [questionId])

  useEffect(() => {
    if ((!isValid && answeredN >= answersMin && answeredN <= answersMax) || (!isValid && answeredN === 0 && props.question.mandatory === 0)) {
      setIsValid(true);
      props.setValidN(props.validN + 1);
    } else {
      if ((isValid && answeredN < answersMin) || (isValid && answeredN > answersMax)) {
        if (answeredN !== 0 || props.question.mandatory === 1) {
          setIsValid(false);
          props.setValidN(props.validN - 1);
        }
      }
    }
  }, [answeredN])

  return (
    <div className='row form-group mb-4 mt-4'>
      <label className='form-control' htmlFor={"question" + props.question.questionId}>{props.question.title}</label>
      <div className='col' align='left'>{props.question.mandatory ? <small className='form-text text-danger'> This question is mandatory.</small> : ""}
        {answersMax !== answersMin ? <small className='form-text text-muted'> You have to choose between {answersMin} and {answersMax} answers.</small> :
          <small className='form-text text-muted'>You have to choose {answersMin} answer(s) </small>}
        {answersList.length !== 0 ? <div> {answersList.map((a) =>
          <AnswerDisplay questionId={questionId} key={a.key} answer={a} answeredN={answeredN} setAnsweredN={setAnsweredN} />
        )} </div> : <p>There is no answers provided for this question.</p>}
      </div></div>
  );
}

// Display a possible answer to a closed question --> Checkbox + Title + Check validity
function AnswerDisplay(props) {
  const [isChecked, setIsChecked] = useState(false);

  const handleClick = () => {
    if (isChecked) {
      props.setAnsweredN(props.answeredN - 1);
      setIsChecked(false);
    } else {
      props.setAnsweredN(props.answeredN + 1);
      setIsChecked(true);
    }
  }
  return (
    <div className="form-check">
      <input className="form-check-input" type="checkbox" id={"closedQuestion"} onClick={handleClick} />
      <label className="form-check-label">
        {props.answer.value}
      </label>
    </div>
  );
}

// List of all Surveys publied by the user logged in --> SideBar + SurveyCheck/Survey
function SurveyPublied(props) {
  const [surveyList, setSurveyList] = useState([]);
  const [redirect, setRedirect] = useState(false);

  const handleClick = () => {
    setRedirect(true);
  };

  useEffect(() => {
    const getSurvey = async () => {
      const survey = await API.getSurveyPublied();
      setSurveyList(survey);
    }

    getSurvey();
  }, []);

  return (
    <div className='row col-12'>
      {redirect ? <Redirect to="/new" /> : ""}
      <SideBar />
      <main className='col-9'>
        {surveyList.length !== 0 ?
          <ul> {surveyList.map(s => <SurveyCheck survey={s} />)} </ul> : <p> You have not uploaded any survey yet. </p>
        }

        <button className='btn btn-primary btn-lg' onClick={handleClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" className="bi bi-plus-lg mr-2" viewBox="0 0 16 16">
            <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
          </svg>
          Create a Survey</button>
      </main>
    </div>
  );
}

// Information of a Survey --> Title + Author(the user logged in) + Number of answers + Link to check Answers
function SurveyCheck(props) {
  const [redirect, setRedirect] = useState(false);
  const [author, setAuthor] = useState("");
  const [NResponses, setNResponses] = useState(0);

  const handleClick = () => {
    setRedirect(true);
  };

  useEffect(() => {
    const getInfo = async () => {
      const authorDB = await API.getAuthor(props.survey.surveyId);
      const nResponsesDB = await API.getNumberResponses(props.survey.surveyId);
      setAuthor(authorDB[0].name);
      setNResponses(nResponsesDB[0].total);
    }

    getInfo();
  }, []);

  return (
    <li className='row col justify-content-between border border-primary rounded mt-2'>
      {redirect ? <Redirect to={"/check-survey/" + props.survey.surveyId} /> : ""}
      <div className='col-8' align='left'>
        <h3>{props.survey.title}</h3>
        <ul className='list-unstyled ml-5'>
          <li> Posted by {author} </li>
          <li> Already answered by {NResponses} people</li>
        </ul>
      </div>
      <div className='col-4' align='right'>
        <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" fill="#0275D8" className="bi bi-archive mt-2" viewBox="0 0 16 16" onClick={handleClick}>
          <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
        </svg>
      </div>

    </li>
  );
}

// Answer to a Survey --> Allow to switch to another answer + ResponseDisplay
function AllResponseCheck(props) {
  const [responseList, setResponseList] = useState([])
  const [index, setIndex] = useState(0)
  const [active, setActive] = useState([])
  const [questionList, setQuestionList] = useState([]);
  const [surveyInfo, setSurveyInfo] = useState([]);

  const surveyId = useParams().surveyId;

  const handleClickRight = () => {
    setIndex(index + 1)
  }

  const handleClickLeft = () => {
    setIndex(index - 1)
  }

  useEffect(() => {
    const getResponseFromDB = async () => {
      const responseListDB = await API.getResponseList(surveyId)
      setResponseList(responseListDB)
      const questionListDB = await API.getQuestionList(surveyId)
      setQuestionList(questionListDB)
      const info = await API.getSurveyById(surveyId)
      setSurveyInfo(info)
    }
    getResponseFromDB();
  }, []);

  useEffect(() => {
    const getResponseActive = async () => {
      if (responseList.length !== 0) {
        const responseActive = await API.getResponseById(responseList[index].sId)
        setActive(responseActive)
      }
    }

    getResponseActive();
  }, [index, responseList]);

  return (
    <>
      {responseList.length !== 0 ? <>

        <div className='row mt-3'>
          <div className='col'>
            {surveyInfo.length !== 0 ? <h2>{surveyInfo[0].title}</h2> : ""}
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col'>
            {index === 0 ?
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="#D9E2Ef" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
              </svg> :
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="#0275D8" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16" onClick={handleClickLeft}>
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
              </svg>
            }
            <span className='ml-2 mr-2'>  {index + 1} / {responseList.length}  </span>
            {index === responseList.length - 1 ?
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="#D9E2Ef" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
              </svg> :
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="#0275D8" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16" onClick={handleClickRight}>
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
              </svg>
            }
          </div>
        </div>
        <div className='row'>
          <div className='col-1' />
          <div className='col-10'>
            {active.length !== 0 ? <ResponseDisplay response={active} questions={questionList} /> : ""}
          </div>
        </div>
      </>
        : <div className='row mt-3'>
          <div className='col'>
            <p> You don't have access to this survey OR no one answered it already.</p>
          </div>
        </div>}
    </>
  );
}

// Display an answer to the survey --> Username + OpenResponseDisplay/Open question + ClosedResponseDisplay/Closed question
function ResponseDisplay(props) {
  return (
    <div className='col mt-4'>
      {props.response.length !== 0 ? <h4>Filled by {props.response[0].username}</h4> : ""}
      <form className='form-group'>
        {(props.questions.length !== 0 && props.response.length !== 0) ? props.questions.map(q => <>{
          props.response.map(r => <>{
            r.questionId === q.questionId ? <>{q.open ? <OpenResponseDisplay question={q} response={r} /> : <ClosedResponseDisplay question={q} response={r} />}</> : ""
          }</>)
        } </>) : ""}
      </form>
    </div>
  );
}

// Display an answer to an open question --> Title + TextArea(readonly)
function OpenResponseDisplay(props) {
  return (
    <div className='row form-group mb-4 mt-4'>
      <label className='form-control'>{props.question.title}</label>
      <textarea className="form-control" rows="3" value={props.response.content} readOnly></textarea>
    </div>
  );
}

// Display an answer to a closed question --> Title + AnswerCheck/Answer
function ClosedResponseDisplay(props) {
  const [answersList, setAnswersList] = useState([]);

  useEffect(() => {
    const getAnswers = async () => {
      const answers = await API.getAnswersList(props.question.questionId)
      setAnswersList(JSON.parse(answers[0].options));
    }

    getAnswers();
  });

  return (
    <div className='row form-group mb-4 mt-4'>
      <label className='form-control'>{props.question.title}</label>
      <div className='col' align='left'>
        {answersList.length !== 0 ? <div> {answersList.map((a) =>
          <AnswerCheck key={a.key} answer={a} response={JSON.parse(props.response.content)[a.key - 1]} />
        )} </div> : <p>{answersList.length}</p>}
      </div>
    </div>
  );
}

// Display a possible answer to a closed question --> Checkbox(readonly) + Title
function AnswerCheck(props) {
  return (
    <div className="form-check">
      <input className="form-check-input" type="checkbox" readOnly checked={props.response} />
      <label className="form-check-label">
        {props.answer.value}
      </label>
    </div>
  );
}

// Allow the administrator to create a new survey --> Title + OpenQuestionCreator + ClosedQuestionCreator + Submit Button
function NewSurvey(props) {
  const [title, setTitle] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const [valid, setValid] = useState(false);
  const [show, setShow] = useState(false);
  const [modified, setModified] = useState(false);
  const [problem, setProblem] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if(valid) {
      try{
        API.postNewSurvey(title, questionList);
        setRedirect(true)
      } catch(err) {
        console.log(err);
      }
    }
  }

  const handleDelete = (id) => {
    questionList.splice(id, 1);
    setModified(true);
  }

  const handleDown = (id) => {
    if (id < questionList.length - 1) {
      let temp = questionList[id]
      questionList[id] = questionList[id + 1]
      questionList[id + 1] = temp
    }
    setModified(true);
  }

  const handleUp = (id) => {
    if (id > 0) {
      let temp = questionList[id]
      questionList[id] = questionList[id - 1]
      questionList[id - 1] = temp
    }
    setModified(true);
  }

  const modifyQuestionTitle = (id, title) => {
    questionList[id].title = title;
    setModified(true);
  }

  const modifyMandatory = (id) => {
    if (questionList[id].mandatory) {
      questionList[id].mandatory = false;
    } else {
      questionList[id].mandatory = true;
    }
    setModified(true)
  }

  const AddAnswer = (id) => {
    questionList[id].content.push({
      value: ""
    });
    setModified(true);
  }

  const modifyAnswer = (id, answerId, answer) => {
    questionList[id].content[answerId].value = answer;
    setModified(true);
  }

  const deleteAnswer = (id, answerId) => {
    questionList[id].content.splice(answerId, 1)
  }

  const setMax = (id, value) => {
    questionList[id].max = value;
    setModified(true);
  }

  const setMin = (id, value) => {
    questionList[id].min = value;
    setModified(true);
  }

  const setContent = (id, content) => {
    questionList[id].content = content
  }

  const AddOpenQuestion = () => {
    questionList.push({
      title: "",
      type: "open",
      mandatory: false,
      content: ""
    })
    setShow(false);
    setModified(true);
  }

  const AddClosedQuestion = () => {
    questionList.push({
      title: "",
      type: "closed",
      mandatory: false,
      content: [],
      min: 0,
      max: 0
    })
    setShow(false);
    setModified(true);
  }

  useEffect(() => {
    let validVerif = true;
    if(title === "") {
      setProblem('The survey has no title.');
      validVerif = false;
    }
    if(questionList.length===0){
      setProblem('You must provide at least 1 question.');
      validVerif=false;
    }
    questionList.forEach(q => {
      if(q.type === 'open') {
        if(q.title === "") {
          setProblem('An open question has no title.');
          validVerif = false;
        }
      } else {
        if(q.title === "") {
          validVerif = false;
          setProblem('A closed question has no title.');
        }
        q.content.forEach(a => {
          if(a.value === "") {
            setProblem('A closed question has a possible answer without value.');
            validVerif = false;
          }
        })
        if(q.max < q.min) {
          setProblem('A closed question has a max number of answers to provide lower than the min number.');
          validVerif = false;
        }
        if(q.min < 1 && q.mandatory) {
          setProblem('A closed question has a min number of answers to provide lower than 1 while being mandatory.');
          validVerif = false;
        }
      }
    })

    setValid(validVerif);
  }, [modified])

  useEffect(() => {
    setModified(false);
  }, [modified])

  return (
    <div className='row'>
      {redirect ? <Redirect to="/"/> : ""}
      <div className='col-1' />
      <div className='col-10'>
        <form className='form-group' onSubmit={handleSubmit}>
          <div className='form-group row mt-4 mb-4'>
            <Modal show={show} onHide={() => setShow(false)} animation={false}>
              <Modal.Header closeButton>
                <Modal.Title>What type of question ?</Modal.Title>
              </Modal.Header>
              <ModalBody>
                <button className='btn btn-primary form-control mt-2' onClick={AddOpenQuestion}>Open Question</button>
                <button className='btn btn-primary form-control mt-2' onClick={AddClosedQuestion}>Closed Question</button>
              </ModalBody>
            </Modal>
            <label className='col-4' htmlFor={"title"}>Enter the title of the survey :</label>
            <input type='text' className='form-control col-7' id='title' value={title} onChange={ev => {setModified(true); setTitle(ev.target.value)}} />
          </div>
          {questionList.length !== 0 ? <ul className='list-unstyled'> {questionList.map(q =>
            <li>
              <div className='row'>
                <div className='col-9'>
                  {q.type === "open" ? <OpenQuestionCreator id={questionList.indexOf(q)} question={q} modifyTitle={modifyQuestionTitle} modifyMandatory={modifyMandatory} /> :
                    <ClosedQuestionCreator id={questionList.indexOf(q)} question={q} modifyTitle={modifyQuestionTitle} modifyMandatory={modifyMandatory} setMax={setMax} setMin={setMin} setContent={setContent} AddAnswer={AddAnswer} modifyAnswer={modifyAnswer} deleteAnswer={deleteAnswer} />}
                </div>
                <div className='col-3'>
                  {questionList.indexOf(q) === 0 ? <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="#D9E2Ef" className="bi bi-arrow-up-short" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
                  </svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="#0275D8" className="bi bi-arrow-up-short" viewBox="0 0 16 16" onClick={() => handleUp(questionList.indexOf(q))}>
                      <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
                    </svg>}
                  {questionList.indexOf(q) === questionList.length - 1 ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="#D9E2Ef" className="bi bi-arrow-down-short" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
                    </svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="#0275D8" className="bi bi-arrow-down-short" viewBox="0 0 16 16" onClick={() => handleDown(questionList.indexOf(q))}>
                      <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
                    </svg>}
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="#DF4759" className="bi bi-x-octagon ml-2" viewBox="0 0 16 16" onClick={() => handleDelete(questionList.indexOf(q))}>
                    <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </div>
              </div>
            </li>
          )}</ul> : ""}
          <div className='row'>
            <div className='col'>
              <button className='btn btn-primary mt-4 mb-4' type='button' onClick={() => setShow(true)}>Add a question</button>
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              {valid ? <button className='btn btn-primary' type='submit'>Submit</button> :
                <>
                  {!valid ? <p className='text-danger'>{problem}</p> : ""}
                  <button className='btn btn-secondary'>Submit</button> </>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Allow the administrator to create an open question --> Title + options
function OpenQuestionCreator(props) {
  return (
    <div className='row form-group mb-4 mt-4'>
      <label className='col-2'>Question : </label>
      <input type='text' className='form-control col-10' id='title' value={props.question.title} onChange={ev => props.modifyTitle(props.id, ev.target.value)} />
      <div className='form-check'>
        <input className="form-check-input" type="checkbox" onClick={() => props.modifyMandatory(props.id)} checked={props.question.mandatory} />
        <label className="form-check-label"> The question is mandatory. </label>
      </div>
      <textarea className="form-control mt-1" rows="3" value="The answer will be written here." readOnly></textarea>
    </div>
  );
}

// Allow the administrator to create a closed question --> Title + options
function ClosedQuestionCreator(props) {
  const [answersList, setAnswersList] = useState([]);
  const [numberList, setNumberList] = useState([0]);
  const [modified, setModified] = useState(false);

  const modifyAnswer = (answerId, answer) => {
    props.modifyAnswer(props.id, answerId, answer)
    setModified(true);
  }

  const AddAnswer = () => {
    props.AddAnswer(props.id);
    setModified(true);
  }

  const handleDelete = (id) => {
    props.deleteAnswer(props.id, id);
    setModified(true);
  }

  const setMin = (value) => {
    props.setMin(props.id, value);
    if(props.question.max < value) {
      props.setMax(props.id, value);
    }
    setModified(true)
  }

  const setMax = (value) => {
    props.setMax(props.id, value);
    if(props.question.min > value) {
      props.setMin(props.id, value);
    }
    setModified(true)
  }

  useEffect(() => {
    let result = [];
    for (let i = 0; i <= props.question.content.length; i++) {
      result.push(i)
    }
    setNumberList(result)
  }, [modified]);

  useEffect(() => {
    setModified(false);
    //props.setContent(props.id, JSON.stringify(answersList));
  }, [modified])

  return (
    <div className='row form-group mb-4 mt-4'>
      <label className='col-2'>Question : </label>
      <input type='text' className='form-control col-10' id='title' value={props.question.title} onChange={ev => props.modifyTitle(props.id, ev.target.value)} />
      <div className='col-12 form-check' align='left'>
        <input className="form-check-input" type="checkbox" onClick={() => props.modifyMandatory(props.id)} checked={props.question.mandatory} />
        <label className="form-check-label"> The question is mandatory. </label>
      </div>
      <div className='col-12 form-check' align='left'>
        <label className='form-check'>You have to provide between
          <select className="form-control-sm" value={props.question.min} onChange={ev => setMin(ev.target.value)}>
            {numberList.map(n =>
              <>{props.question.max === 0 ? <option key={n}> {n} </option> :
                <>{n <= props.question.max ? <option key={n}> {n} </option> : ""} </>
              }</>
            )}
          </select> and <select className="form-control-sm" value={props.question.max} onChange={ev => setMax(ev.target.value)}>
            {numberList.map(n =>
              <>{props.question.min === 0 ? <option key={n}> {n} </option> :
                <>{n >= props.question.min ? <option key={n}> {n} </option> : ""} </>
              }</>
            )}
          </select> answers. </label>
      </div>
      <div className='col-10 form-check' align='left'>
        {props.question.content.length !== 0 ?
          <ul className='list-unstyled'>
            {props.question.content.map(a =>
              <li>
                <div className='row mt-1'>
                  <label className='col-1'>{props.question.content.indexOf(a) + 1}.</label>
                  <input type='text' className='text form-control col-9' id='answer' value={a.value} onChange={ev => modifyAnswer(props.question.content.indexOf(a), ev.target.value)} />
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="#DF4759" className="bi bi-x-octagon ml-2" viewBox="0 0 16 16" onClick={() => handleDelete(props.question.content.indexOf(a))}>
                    <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </div>
              </li>)}
          </ul>
          : ""}
      </div>
      <div className='col-10 form-check mt-3' align='center'>
        <button type='button' className='btn btn-primary col-9' onClick={AddAnswer}>Add an answer</button>
      </div>
    </div >
  );
}

export default App;
