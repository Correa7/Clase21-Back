const express = require('express')
const UserServices = require('../services/users.services')
const {isValidPass} = require ('../../utils/bcrypt')
const Service = new UserServices()
const passport = require('passport')
const {isUser, isAdmin} = require('../../middlewares/middleware.auth')

const {Router} = express
const router = new Router() 


router.get('/register', (req,res)=>{
    res.status(200).render('register',{
        style: 'register.css',
        title:'Register'
    })
})
router.post('/register', passport.authenticate('register-passport', { failureRedirect: '/sessions/failed-register' }), (req,res)=>{
    
    if (!req.user) {
        return res.json({ error: 'something went wrong' });
      }
    req.session.user = { _id: req.user._id, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name, rol: req.user.rol }; 
    // return res.json({ msg: 'ok', payload: req.user });
    return res.redirect('/products'); 
})

router.get('/login', (req,res)=>{
    res.status(200).render('login',{
        style: 'login.css',
        title:'Login'
    }) 
})
router.post('/login', passport.authenticate('login-passport', { failureRedirect: '/session/register' }), (req,res)=>{

    if (!req.user) {
        return res.json({ error: 'invalid credentials' });
      }
      req.session.user = { _id: req.user._id, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name, rol: req.user.rol };
    console.log( req.session.user)
    // return res.json({ msg: 'ok', payload: req.user });
    return res.redirect('/session/profile');
})


router.get('/profile', (req,res)=>{
    let data = req.session.user
    console.log('Esto es data del profile: ' + JSON.stringify(data))
   res.render('profile',{
    style:'profile.css',
    title:'Profile',
    data:data,
  
   })
})
router.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err) res.send('Failed Logout')
        return res.redirect('/session/login') 
    })
})
router.get('/failed-register', (req,res)=>{
    res.send('failed user registration')
})


// router.post('/login', async (req,res)=>{

//     let session = req.session.userEmail 
//     console.log(session)
//     let data = req.body
//     console.log(data)
//     try{
//         let users= await Service.getAll()
//         let userFound= users.find(user=>{
//            return user.email == data.email 
//         } )
//         console.log(userFound)
//         if(!userFound){
//             res.status(401).send('User not found or does not exist') 
//         }
//         else{
//             if(!isValidPass(userFound, data.password)){
//                 res.status(401).send('Invalid email or password') 
//             }
//             else{
//                 console.log('Usuario Encontrado')
    
//                 req.session.userEmail = data.email
//                 req.session.userPassword = data.password
                
//                 res.render('profile',{
//                     data:{name:userFound.first_name,last_name:userFound.last_name},
//                 })
//             }
//         }
//     }
//     catch{
//         return res.status(500).json({
//             status: 'error',
//             msg: 'something went wrong :(',
//             data: {},
//         });
//         }
    
// })


module.exports = router