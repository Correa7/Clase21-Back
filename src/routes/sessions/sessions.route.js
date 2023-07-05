const express = require('express')
const UserServices = require('../services/users.services')

const Service = new UserServices()

const {Router} = express
const router = new Router()

async function auth (req, res, next){
    let {email,password}= req.body
    if (req.session.userEmail){
        next()
    }
    return res.status(401).send('Error en Autenticacion')
    // console.log(email,' :', password)
    // try{
    //     let users= await Service.getAll()
    //     let userFound= users.find(user=>{
    //        return user.email == email && user.password == password
    //     } )
    //     if(userFound){
    //       next()
    //     }
    //     return res.status(401).send('Error en Autenticacion')

    //     }
    //     catch{
    //         return res.status(500).json({
    //             status: 'error',
    //             msg: 'something went wrong :(',
    //             data: {},
    //         });
    //     }
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
    let session=req.session.userEmail
    console.log(session)
    let {email,password}= req.body
    try{
        let users= await Service.getAll()
        let userFound= users.find(user=>{
           return user.email == email && user.password == password
        } )
        if(userFound){
            console.log('Usuario Encontrado', userFound)
            req.session.userEmail= email
            req.session.userPassword= password
            
            res.render('profile',{
                data:{name:userFound.first_name,last_name:userFound.last_name},
                // session:session
            })
        }
        else{
            console.log('Usuario no encontrado')
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



module.exports = router