const express = require('express')
const UserServices = require('../services/users.services')
const {isValidPass} = require ('../../utils/bcrypt')
const Service = new UserServices()

const {Router} = express
const router = new Router()

async function auth (req, res, next){
    let {email,password}= req.body
    if (req.session.userEmail){
        next()
    }
    return res.status(401).send('Error en Autenticacion')
  
}

router.get('/register', (req,res)=>{
    res.status(200).render('register',{
        style: 'register.css',
        title:'Register'
    })
})
router.get('/login', (req,res)=>{
    res.status(200).render('login',{
        style: 'login.css',
        title:'Login'
    }) 
})
router.post('/login', async (req,res)=>{

    let session = req.session.userEmail
    console.log(session)
    let data = req.body
    console.log(data)
    try{
        let users= await Service.getAll()
        let userFound= users.find(user=>{
           return user.email == data.email 
        } )
        console.log(userFound)
        if(!userFound){
            res.status(401).send('User not found or does not exist') 
        }
        else{
            if(!isValidPass(userFound, data.password)){
                res.status(401).send('Invalid email or password') 
            }
            else{
                console.log('Usuario Encontrado')
    
                req.session.userEmail = data.email
                req.session.userPassword = data.password
                
                res.render('profile',{
                    data:{name:userFound.first_name,last_name:userFound.last_name},
                })
            }
        }
    }
    catch{
        return res.status(500).json({
            status: 'error',
            msg: 'something went wrong :(',
            data: {},
        });
        }
    
})
router.get('/profile', (req,res)=>{
   res.render('profile',{
    style:'profile.css',
    title:'Profile',
    data:data,
  
   })
})
router.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err) res.send('Failed Logout')
        res.redirect('/session/login')
    })
})
router.get('/failed-register', (req,res)=>{
    res.send('failed user registration')
})



module.exports = router