const User = require('../../dao/models/users.model')

class UserServices{

    async getAll() {
        const users = await User.find();
          return users;
      }
      async getById(_id) {
        const user = await User.findOne({ _id: _id });
        return user;
      }
      async createOne(data) {
        const user = await User.create(data);
        return user;
      }
      async deletedOne(_id) {
        const deleted = await User.deleteOne({ _id: _id });
        return deleted;
      }
      async updateOne(_id, first_name, last_name,  email, age, password, rol) {
        const userUpDate = await User.updateOne({ _id: _id }, {first_name, last_name,  email, age, password, rol});
        return userUpDate;
      }
}

module.exports= UserServices