const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    savedIngredients: Array
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;