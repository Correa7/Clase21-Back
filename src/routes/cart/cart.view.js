// Además, agregar una vista en ‘/carts/:cid (cartId) para visualizar un carrito específico,
// donde se deberán listar SOLO los productos que pertenezcan a dicho carrito. 
const express= require('express')
const CartView = express.Router()
const Cart= require('../../dao/models/cart.model')
const cartService= require('../services/cart.services')
const Service = new cartService()

  
CartView.use(express.json())
CartView.use(express.urlencoded({extended:true}))

CartView.get('/:cId', async(req,res)=>{
    let id = req.params.cId
    let cartData = await Cart.findOne({_id:id}).populate('products.product')
    // console.log(cartData) 
    const products= cartData.products.map(item=>{ 
        return {
            title:item.product.title,
            description:item.product.description,
            price:item.product.price,
            thumbnail: item.product.thumbnail,
            code: item.product.code,
            stock: item.product.stock, 
            category:item.product.category,
            status:true,
            _id:item.product._id,
            quantity:item.quantity
        }

    })
    // console.log(products) 
    return res.status(201).render('cart', {
        products:products, 
        style:'cart.css',
        title:'Cart'}) 
})

module.exports= CartView