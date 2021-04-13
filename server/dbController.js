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
    newUser.username = req.body.name;
    newUser.password = req.body.pass;
    newUser.savedIngredients = req.body.ingredients;

    return newUser.save();
}

exports.updateOne = (req, res) => {
    return Users.updateOne({ username: req.body.name }, 
        { 
            $set: { "savedIngredients": req.body.ingredients }
        })
}

