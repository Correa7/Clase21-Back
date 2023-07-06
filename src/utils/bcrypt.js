const bcrypt = require('bcrypt')

const createHash = (pass) => {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
}
const isValidPass = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}
module.exports = {
    createHash,
    isValidPass 
}