const { logger } = require('./internal/logger')

require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const { connect } = require('./internal/db-connection')

const router = require('./src/router')
const responseFormatter = require('./internal/response')


const exceptionHandler = require('./internal/exception-handler')
// start :: config

// connect to database
connect()

app.use(morgan('dev'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())
app.use(cors())
app.use(helmet()) // secures app by setting various HTTP headers.

app.use(responseFormatter)
// end :: config

// routing
app.use('/api', router)

app.use((req, res, next) => {
    const err = new Error('URL Not Found');
    err.status = 404;
    next(err);
});


app.use(exceptionHandler);


// starting server
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`)
})

module.exports.server = server
module.exports.app = app