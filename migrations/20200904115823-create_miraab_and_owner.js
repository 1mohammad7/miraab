const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { logger } = require('../internal/logger');
const { result } = require('lodash');
const { APP_TYPE, STRATEGY } = require('../internal/constants');
const USERNAME = 'admin'
const PASSWORD = 'qwerty'
const PROJECT_ID = 'miraab'

module.exports = {
    async up(db) {
        // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
        // Example:
        // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
        console.log("ALLO");
        const userCollection = db.collection('users');
        const appCollection = db.collection('apps');


        var hash = bcrypt.hashSync(PASSWORD, 10);
        const userMock = {
            username: USERNAME,
            password: hash,
        }
        const user = await new Promise((resolve, reject) => {
            userCollection.insertOne(userMock, (err, result) => {
                if (err) {
                    logger.info('error on adding user')
                    reject(err)
                } else {
                    logger.info('successfully added user')
                    resolve(result)
                }
            })
        })
        const appMock = {
            name: 'Miraab',
            owner: user._id,
            type: APP_TYPE.M2M,
            strategy: STRATEGY.STRATEGY_USERNAME,
            identifier: PROJECT_ID
        }


        return appCollection.insertOne(appMock, (err, result) => {
            if (err) {
                logger.info('error on adding app')
            } else {
                logger.info('successfully added app')
            }
        })


    },

    down(db) {
        // Example:
        // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
        db.collection('users').removeOne({
            username: USERNAME
        }, (err, result) => {
            if (err) {
                logger.info('error while removing user')
            } else {
                logger.info('successfully removed user')

                db.collection('apps').removeOne({
                    identifier: PROJECT_ID
                }, (err, result) => {
                    if (err) {
                        logger.info('error while removing app')
                    } else {
                        logger.info('successfully removed app')


                    }
                })
            }
        })

    }
};