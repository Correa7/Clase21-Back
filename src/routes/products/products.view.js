const express = require('express')
const ProductServices= require('../services/product.services')

const productViews = express.Router() 
const Service= new ProductServices()

productViews.get('/', async (req,res)=>{
    const {limit, page, sort, ...data} = req.query

    const productData= await Service.getAll(page,limit,sort, data) 
    const products= productData.docs.map(item=>{
        return {
            title:item.title,
            description:item.description,
            price:item.price,
            thumbnail: item.thumbnail,
            code: item.code,
            stock: item.stock, 
            category:item.category,
            status:true,
            _id:item._id
        }
    })

    const { docs, ...rest } = productData;
  let links = [];

  for (let i = 1; i < rest.totalPages + 1; i++) {
    links.push({ label: i, href: 'http://localhost:8080/products/?page=' + i });
    }


    return res.status(201).render('products', {
        products:products, 
        pagination:rest, 
        links:links,
        style:'products.css',
        title:'Products'}) 
})






module.exports= productViews