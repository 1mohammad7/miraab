class BaseError extends Error {
    constructor(code, message, status) {
        super(message);
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        this.code = code

        this.status = status || code * 100
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        //  @see Node.js reference (bottom)
        Error.captureStackTrace(this, this.constructor);

        this.shouldPrintStack = this.status == 5
    }
}

module.exports = BaseError