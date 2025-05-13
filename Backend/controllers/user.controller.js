const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');


module.exports.registerUser = async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the fields properly
    const { fullname, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
        return res.status(400).json({ error: "User already exists" });
    }




    // Ensure that fullname is correctly structured
    if (!fullname || !fullname.firstname || !fullname.lastname) {
        return res.status(400).json({ error: "Fullname is incomplete" });
    }

    // Hash the password before saving the user
    const hashedPassword = await userModel.hashPassword(password);

    // Create a new user
    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
};