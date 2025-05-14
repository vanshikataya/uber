const captainModel=require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');  


module.exports.registerCaptain = async (req, res, next) => {
const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password, color, plate, capacity, vehicleType } = req.body;
const isCaptainAlreadyExist = await captainModel.findOne({email})
      // Hash the password before saving the captain
    const hashedPassword = await captainModel.hashPassword(password);
if(isCaptainAlreadyExist){
        return res.status(400).json({ error: "Captain already exists" });
    }
    // Create a new captain
    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color:vehicle.color,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });
}