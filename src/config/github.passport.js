const passport = require('passport')
const gitHubStrategy = require('passport-github2').Strategy
const User = require('../dao/models/users.model')


const gitHubPassport = () =>{
    passport.use('auth-github', new gitHubStrategy(
        {
            clientID: '4612e26dbfd329ebc15e',
            clientSecret: '4917423b1c6a348777c89f4b4f3af291e2dd5578',
            callbackURL: "http://localhost:8080/auth/github/callback"
        },
        async (accessToken, refreshToken, profile, done)=>{
            try{
              console.log(profile)
                let userFound = await User.findOne({email:profile._json.email})
                if(userFound){
                    console.log('User already exists')
                    done(null,false)
                }
                let userNew = {
                    first_name: profile._json.name,
                    last_name:profile._json.name,
                    email:profile._json.email,
                    age: 18,
                    password:'1', 
                    rol: 'User'
                }
                let result = await User.create(userNew)
                done(null, result)
            }
            catch (err){
                return done('Error creating user' + err)
            }
          } 
    ))

}

module.exports = gitHubPassport
