const express = require('express')
const User = require('../../dao/models/users.model')
const UserServices = require('../services/users.services')
const {createHash} = require ('../../utils/bcrypt')
const passport = require('passport')

const Service = new UserServices()

const {Router} = express
const router = new Router()
router.use(express.json())
router.use(express.urlencoded({extended:true}))

router.get('/', async (req,res)=>{

    try{
        const users = await Service.getAll();
        return res.status(200).json({
            status: 'success',
            msg: 'Users founds',
            data: users,
        })
    }
    catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
})
router.get('/:id', async (req, res) => {

    try {
    const _id = req.params.id;
    const user= await  Service.getById(_id)
    return user? 
     res.status(200).json({
        status: 'success', 
        msg: 'User Get by ID',
        data:user,
      }):
       res.status(200).json({
        status: 'error',
        msg: 'User not found',                                                             
        data: user,
      })
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
    })
router.post('/', passport.authenticate('register-passport',{failureRedirect:'/session/failed-register'}),(req, res) => {
    res.redirect('/session/login')
    // try {
    // const data= req.body
    // console.log(data)
    // data.password= createHash(data.password)
    // const userCreated = await Service.createOne(data);
    // return  res.redirect('/session/login')
    // } 
    // catch (e) {
    // console.log(e);
    // return res.status(500).json({
    //     status: 'error',
    //     msg: 'something went wrong :(',
    //     data: {},
    // });
    // }
});
router.delete('/:id', async (req, res) => {
    try {
    const _id = req.params.id;
    await Service.deletedOne(_id)
    return res.status(200).json({
        status: 'success',
        msg: 'User deleted',
        data: {},
    });
    } catch (e) {
    console.log(e);
    return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
    });
    }
});
router.put('/:id', async (req, res) => {
    try {
    const _id = req.params.id;
    const { first_name, last_name,  email, age, password, rol } = req.body;
    const data= req.body
    console.log(_id)
    await Service.updateOne(_id, first_name, last_name,  email, age, password, rol)
    return res.status(201).json({
        status: 'success',
        msg: 'User update',
        data:data,
    });
    } catch (e) {
    console.log(e);
    return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
    });
    }
});

module.exports = router


