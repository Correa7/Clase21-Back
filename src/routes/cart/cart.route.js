const express = require('express')
const Product= require('../../dao/models/products.model')
const Cart= require('../../dao/models/cart.model')
const CartService= require('../services/cart.services')

const cartService = new CartService()
const { Router } = express

const router = new Router()
 
router.use(express.json())
router.use(express.urlencoded({extended:true}))

router.get('/', (req,res)=> {
    Cart.find({}).lean()
    .then(pr=>{
        res.status(200).send(
            {
                status:'success',
                msg:'cart Find',
                data:pr
            }
        )
    })
    .catch(err=>{
        res.status(500).send(
            console.log('Error loading product')
        )
    })  
     
})
router.post('/', (req,res)=> {
    let data = req.body
    let cart= new Cart(data)
    cart.save()
    .then(pr=>{
        res.status(201).send({
            msg:'Cart create successfully',
            data:data
        })
    })
    .catch(err=>{
        res.status(500).send(
            console.log('Error create Cart')
        )
    })
})
router.get('/:cId', (req,res)=> {
    const cId = req.params.cId
    Cart.findOne({_id:cId})
    .then(pr=>{
        res.status(200).send(
            {
                status:'success',
                msg:'cart Find',
                data:pr
            }
        )
    })
    .catch(err=>{
        res.status(500).send(
            console.log('Error get Cart')
        )
    })  
})
router.post('/:cId/product/:pId', (req,res)=>{
    const cId = req.params.cId
    const pId = req.params.pId
    Cart.findOne({_id:cId})
    .then(pr=>{
        let arr= pr.products
        let prIndex=arr.findIndex(pr=> pr.product._id.toString() === pId)
        if (prIndex != -1) {
                arr[prIndex].quantity++
                let prodnew=[]
                for (let prop of arr){
                    prodnew.push({product:prop.product._id.toString(),quantity:prop.quantity})
                }
                pr.products = prodnew
                Cart.updateOne({_id:cId},pr)
                .then(pr=>{
                    res.status(200).send(
                        {
                            status:'success',
                            msg:'Product added to cart',
                            data:pr
                        }
                    )
                })
                .catch(err=>{
                    res.status(500).send({
                        status: 'error',
                        msg: 'something went wrong :(',
                        data: {},
                    })
                })
        }
        else{
            pr.products.push({ product:pId, quantity:1})
            Cart.updateOne({_id:cId},pr)
            .then(pr=>{
                res.status(200).send(
                    {
                        status:'success',
                        msg:'Product added to cart',
                        data:pr
                    }
                )
            })
            .catch(err=>{
                res.status(500).send({
                    status: 'error',
                    msg: 'something went wrong :(',
                    data: {},
                })
            })
       }
    })
    .catch(err=>{
        res.status(500).send({
            status: 'error',
            msg: 'something went wrong :(',
            data: {},
        })
    }) 
})
router.delete('/:cId', async (req,res)=>{
    let id = req.params.cId
    Cart.findOne({_id:id})
    .then(pr=>{
        let arr=[]
        pr.products=arr
        Cart.updateOne({_id:id}, pr)
        .then(pr=>{
            res.status(200).send({
                status:'success',
                msg:'Products empty',
                data:pr
            })
        })
        .catch(err=>{
            res.status(500).send({
                status:'error',
                msg:'Error: something went wrong :(',
                data:{}
            })
        })
    })
    .catch(err =>{
        res.status(500).send({
            status: 'error',
            msg: 'something went wrong :(',
            data: {}
        })
    }) 
})
router.delete('/:cId/product/:pId', (req,res)=>{
    const cId = req.params.cId
    const pId = req.params.pId
    Cart.findOne({_id:cId})
    .then(pr=>{
        let arr= pr.products 
        let prIndex=arr.findIndex(pr=> pr.product._id.toString() === pId)
        if (prIndex != -1) {
                arr.splice(prIndex, 1)
                let prodnew=[]
                for (let prop of arr){
                    prodnew.push({product:prop.product._id.toString(),quantity:prop.quantity})
                }
                pr.products = prodnew
                console.log(pr)
                Cart.updateOne({_id:cId},pr)
                .then(pr=>{
                    res.status(200).send(
                        {
                            status:'success',
                            msg:'Product Delete to cart',
                            data:pr
                        }
                    )
                })
                .catch(err=>{
                    res.status(500).send({
                        status: 'error',
                        msg: 'something went wrong :(',
                        data: {},
                    })
                })
        }
        else{
                res.status(200).send(
                    {
                        status:'success',
                        msg:'Product not found or dont exist',
                        data:pr
                    }
                )
            
          
       }
    })
    .catch(err=>{
        res.status(500).send({
            status: 'error',
            msg: 'something went wrong :(',
            data: {},
        })
    }) 
})
router.put('/:cId', (req,res)=>{
    let cId = req.params.cId
    let data = req.body
    Cart.findOne({_id:cId})
    .then(pr=>{
        let arr = data
        pr.products=arr
        Cart.updateOne({_id:cId},pr)
                .then(pr=>{
                    res.status(200).send(
                        {
                            status:'success',
                            msg:'Products update',
                            data:pr
                        }
                    )
                })
                .catch(err=>{
                    res.status(500).send({
                        status: 'error',
                        msg: 'something went wrong :(',
                        data: {},
                    })
                })
    })
    .catch(err=>{
        res.status(500).send({
            status: 'error',
            msg: 'something went wrong :(',
            data: {},
        })
    }) 
})
router.put('/:cId/product/:pId', (req,res)=>{
    let cId = req.params.cId
    let pId = req.params.pId
    let {data} = req.body
    Cart.findOne({_id:cId})
    .then(pr=>{
        let arr= pr.products
        let prIndex=arr.findIndex(pr=> pr.product._id.toString() === pId)
        if (prIndex != -1) {
                arr[prIndex].quantity = parseInt(data)
                let prodnew=[]
                for (let prop of arr){
                    prodnew.push({product:prop.product._id.toString(),quantity:prop.quantity})
                }
                pr.products = prodnew
                Cart.updateOne({_id:cId},pr)
                .then(pr=>{
                    res.status(200).send(
                        {
                            status:'success',
                            msg:'Product quantity update',
                            data:pr
                        }
                    )
                })
                .catch(err=>{
                    res.status(500).send({
                        status: 'error',
                        msg: 'something went wrong :(',
                        data: {},
                    })
                })
        }
        else{
            res.status(200).send(
                {
                    status:'success',
                    msg:'Product not found or dont exist',
                    data:pr
                }
            )
       }
    })
    .catch(err=>{
        res.status(500).send({
            status: 'error',
            msg: 'something went wrong :(',
            data: {},
        })
    }) 
})

module.exports = router
