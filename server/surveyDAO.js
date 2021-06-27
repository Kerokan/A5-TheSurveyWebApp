'use strict'

const sqlite3 = require('sqlite3').verbose();

let database = new sqlite3.Database('surveys.db');

exports.getAll = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM survey`;
        database.all(query, (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.getInfo = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM survey WHERE surveyId = "${id}"`;
        database.all(query, (err, row) => {
            if(err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

exports.getQuestions = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM questions WHERE surveyId = "${id}"`;
        database.all(query, (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.getAnswers = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM answers WHERE questionId = "${id}"`;
        database.all(query, (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.postResponse = (answer) => {
    return new Promise((resolve, reject) => {
        const getMaxSid = `SELECT MAX(sid) as max FROM responses WHERE username != "${answer.username}"`;
        database.all(getMaxSid, (err, row) => {
            if(err) {
                reject(err);
            } else {
                const maxSid = row[0].max + 1;
                const query = `INSERT INTO responses VALUES(${maxSid}, "${answer.username}", ${answer.questionId}, "${answer.content}")`;
                database.run(query, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve('inserted');
                    }
                });
            }
        });
    });
};

exports.getAuthor = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT login AS name FROM users u JOIN survey s WHERE s.userId = u.userId AND s.surveyId = "${id}"`;
        database.all(query, (err, row) => {
            if(err) {
                reject(err);
            } else {
                resolve(row);
            }
        })
    });
};

exports.getNumberResponses = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT COUNT(DISTINCT sid) AS total FROM responses AS r JOIN questions AS q WHERE q.questionId = r.questionId AND q.surveyid = "${id}"`;
        database.all(query, (err, row) => {
            if(err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

exports.getSurveyPublied = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM survey WHERE userId = ${id}`
        database.all(query, (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
};

exports.getResponseList = (id, userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT DISTINCT sId FROM responses where questionId IN (SELECT questionId FROM questions AS q JOIN survey AS s WHERE s.surveyId = q.surveyId AND q.surveyid = "${id}" AND s.userId = "${userId}")`
        database.all(query, (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
};

exports.getResponseById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM responses WHERE sId = "${id}" ORDER BY questionId`;
        database.all(query, (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
}

exports.postSurvey = (title, userId) => {
    return new Promise((resolve, reject) => {
        const getMaxId = `SELECT MAX(surveyId) as max FROM survey`;
        database.all(getMaxId, (err, row) => {
            if(err) {
                reject(err);
            } else {
                const maxId = row[0].max + 1;
                const query = `INSERT INTO survey VALUES(${maxId}, "${title}", ${userId})`;
                database.run(query, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(maxId);
                    }
                });
            }
        });
    });
}

exports.postOpenQuestion = (question, questionList, surveyId) => {
    return new Promise((resolve, reject) => {
        const getMaxId = `SELECT MAX(questionId) as max FROM questions`;
        database.all(getMaxId, (err, row) => {
            if(err) {
                reject(err);
            } else {
                const maxId = row[0].max + 1 + questionList.indexOf(question);
                const mandatory = question.mandatory ? 1 : 0
                const query = `INSERT INTO questions VALUES(${maxId}, "${surveyId}", "${question.title}", 1, ${mandatory})`;
                database.run(query, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(maxId);
                    }
                });
            }
        });
    });
}

exports.postClosedQuestion = (question, questionList, surveyId) => {
    return new Promise((resolve, reject) => {
        const getMaxId = `SELECT MAX(questionId) as max FROM questions`;
        database.all(getMaxId, (err, row) => {
            if(err) {
                reject(err);
            } else {
                const maxId = row[0].max + 1 + questionList.indexOf(question);
                const mandatory = question.mandatory ? 1 : 0
                const query = `INSERT INTO questions VALUES(${maxId}, "${surveyId}", "${question.title}", 0, ${mandatory})`;
                database.run(query, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        const content = []
                        question.content.forEach(answer => {
                            content.push({
                                "key": question.content.indexOf(answer) + 1,
                                "value": answer.value
                            });
                        });
                        const query2 = `INSERT INTO answers VALUES(${maxId}, ${question.min}, ${question.max}, '${JSON.stringify(content)}')`;
                        database.run(query2, (err) => {
                            if(err) {
                                reject(err);
                            } else {
                                resolve(maxId);
                            }
                        });
                    }
                });
            }
        });
    });
}