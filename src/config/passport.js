const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../dao/models/users.model')
const {createHash} = require ('../utils/bcrypt')

const initializePassport = () => {

    passport.use('register-passport', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email',},
        async (req, username, password,done) => {
            try{
                let userData = req.body
                let userFound = await User.findOne({email:username})
                if(userFound){
                    console.log('User already exists')
                    done(null,false)
                }
                let userNew = {
                    first_name: userData.first_name,
                    last_name:userData.last_name,
                    email:userData.email,
                    age: userData.age,
                    password:createHash(userData.password),
                    rol: 'User'
                }
                let result = await User.create(userNew)
                done(null, result)
            }
            catch (err){
                return done('Error creating user' + err)
            }
        },
        passport.serializeUser((user,done)=>{
            done(null,user._id)
        }),
        passport.deserializeUser(async (id,done)=>{
            let user= await User.findById(id)
            done(null,user)
        })
    ))
}

module.exports =  initializePassport
