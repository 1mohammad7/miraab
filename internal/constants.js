module.exports = {
    defaults: {},
    CONSTANTS: {
        expire_access_token: '7d', //change it to 30m
        sms_code_length: 5,
        sms_code_check_period: 10, //in seconds
        accesstoken_check_period: 5, //in seconds
        sms_code_expire: 120, //in seconds

    },
    STRATEGY: {
        STRATEGY_USERNAME: 'username',
        STRATEGY_EMAIL: 'email',
        STRATEGY_PHONE: 'phone',
    },
    APP_TYPE: {
        M2M: 'm2m',
        M2C: 'm2c'
    },
    //TODO:
    MIRAAB_APP_ID: '5f522fabe68c4a13d43e8731'
}