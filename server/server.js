'use strict'

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const userDAO = require('./userDAO');
const surveyDAO = require('./surveyDAO');

/* Set up Passport */

passport.use(new LocalStrategy(
    function (username, password, done) {
        userDAO.getUser(username, password).then((user) => {
            if (!user) {
                return done(null, false, { message: 'Incorrect username or password. Try again.' });
            }
            return done(null, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userDAO.getUserById(id).then(user => {
        done(null, user);
    }).catch((err) => {
        done(err, null);
    });
});


// init Express
const app = express();
const PORT = 3001;

app.use(express.json());

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    return res.status(401).json({ error: 'not authenticated' });
}

app.use(session({
    secret: 'The exam of Web Application',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

/*** API ***/

app.get('/survey', (req, res) => {
    surveyDAO.getAll().then((result) => {
        res.status(200).json(result);
    });
});

app.get('/survey/:id', (req, res) => {
    surveyDAO.getInfo(req.params.id).then((result) => {
        res.status(200).json(result);
    });
});

app.get('/publied', isLoggedIn, (req, res) => {
    let id = req.user.id
    surveyDAO.getSurveyPublied(id).then((result) => {
        res.status(200).json(result);
    });
});

app.get('/questions/:id', (req, res) => {
    surveyDAO.getQuestions(req.params.id).then((result) => {
        res.status(200).json(result);
    });
});

app.get('/answers/:id', (req, res) => {
    surveyDAO.getAnswers(req.params.id).then((result) => {
        res.status(200).json(result);
    });
});

app.post('/response', (req, res) => {
    surveyDAO.postResponse(req.body);
});

app.get('/author/:id', (req, res) => {
    surveyDAO.getAuthor(req.params.id).then((result) => {
        res.status(200).json(result);
    });
});

app.get('/numberResponses/:id', (req, res) => {
    surveyDAO.getNumberResponses(req.params.id).then((result) => {
        res.status(200).json(result);
    })
})

app.get('/responseList/:id', (req, res) => {
    surveyDAO.getResponseList(req.params.id).then((result) => {
        res.status(200).json(result)
    })
});

app.get('/response/:id', (req, res) => {
    surveyDAO.getResponseById(req.params.id).then((result) => {
        res.status(200).json(result)
    })
});

app.post('/login', passport.authenticate('local'), async (req, res) => {
    res.json(req.user);
});

app.get('/current', (req, res) => {
    if(req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else {
        res.status(401);
    }
});

app.delete('/current', (req, res) => {
    req.logout();
    res.end();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Check the useEffect() in OpenQuestionDisplay with non mandatory question !!')
});