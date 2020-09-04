const BaseError = require('./base-error')
class UnknownStrategyError extends BaseError {
    constructor(strategy) {
        super(1, `Unknown strategy provided : ${strategy}`, 400);

        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        //  @see Node.js reference (bottom)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = BaseError