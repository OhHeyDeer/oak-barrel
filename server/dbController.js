const Users = require('./db/schema');

exports.getAll = (req, res) => {
    return Users.find({});
}

exports.getOne = (req, res) => {
    // console.log(req.params.name);
    return Users.findOne({ username: req.params.name});
}

exports.addUser = (req, res) => {
    const newUser = new Users();
    newUser.username = req.params.name;
    newUser.password = req.params.pass;
    newUser.savedIngredients = req.params.ingredients;

    return newUser.save();
}

exports.updateOne = (req, res) => {
    return Users.updateOne({ username: req.body.name }, 
        { 
            $set: { "savedIngredients": req.body.ingredients }
        })
}

