const cache = require('./cache')
const axios = require('axios')
const MIRAAB_CHECK_ACCESS_URL = 'localhost:5000/api/auth/check_access'
request(options, function(error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
module.exports.validate = (accessToken) => {
    //check cache , if ok , return true if not , ask API , if valid add to cache and return true
    const cached = cache.isTokenCached(accessToken)
    if (cached) {
        return cached
    } else {
        //req to api , if ok , save to cache and return , if not , dont validate
        const result = axios.get(MIRAAB_CHECK_ACCESS_URL, {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        })
        if (result.code == 2) {
            cache.cacheToken(result.accessToken, result.data)
            return accessToken
        } else {
            return false
        }
    }
}