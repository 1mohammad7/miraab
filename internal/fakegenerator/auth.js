const mongoose = require('mongoose')
const faker = require('faker')
const randomItem = require('random-item')

faker.locale = 'fa'

module.exports.basic_user = (number) => {
    if (number === 0) {
        return this.basic_user(1)[0]
    }
    const items = []
    for (let index = 0; index < number; index++) {
        items.push({
            phoneNumber: faker.phone.phoneNumber('09#########')
        })
    }
    return items
}