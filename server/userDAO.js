'use strict'

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

let database = new sqlite3.Database('surveys.db');

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE userId = ?`;
        database.get(query, [id], (err, row) => {
            if(err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = {id: row.userId, username: row.login};
                resolve(user);
            }
        });
    });
};

exports.getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE login = ?`;
        database.get(query, [username], (err, row) => {
            if(err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = {id: row.userId, username: row.login}
                
                bcrypt.compare(password, row.password).then(result => {
                    if(result) {
                        resolve(user);
                    }
                    else {
                        resolve(false);
                    }
                });
            }
        });
    });
};