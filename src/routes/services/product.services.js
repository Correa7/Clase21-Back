const Product= require('../../dao/models/products.model')

class ProductServices {

  async getAll( page, limit, sort, data ) {
    if(sort){
      const product = await Product.paginate({}, { limit:limit || 8, page: page || 1, sort:{price:sort || 'asc'}});
    return product; 
    }
    else if (data){
      const product = await Product.paginate(data, { limit:limit || 8, page: page || 1,});
    return product;
    }
    else{
      const product = await Product.paginate({}, { limit:limit || 8, page: page || 1,});
      return product;
    }

  }
  async getById(_id) {
    const product = await Product.findOne({ _id: _id });
    return product;
  }
  async createOne(data) {
    
    const productCreated = await Product.create(data);
    return productCreated;
  }
  async createMany(data){
    const productsCreated = await Product.insertMany(data)
    return productsCreated
  }

  async deletedOne(_id) {
    const deleted = await Product.deleteOne({ _id: _id });
    return deleted;
  }

  async updateOne(_id,title, description, thumbnail, code, stock, category, status) {
    const productUpDate = await Product.updateOne({ _id: _id }, {title, description, thumbnail, code, stock, category, status });
    return productUpDate;
  }
}
module.exports = ProductServices  