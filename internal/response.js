module.exports = (req, res, next) => {
    res.formatter = (code, data, status) => {
        if (status == undefined) {
            status = code * 100
        }
        res.status(status).send({
            code,
            data
        })
    }
    next()
}