const userModel = require('../models/user.model');

const createUser = async ({ firstname, lastname, email, password }) => {
    const user = new userModel({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });
    await user.save();
    return user;
};

module.exports = {
    createUser
};
