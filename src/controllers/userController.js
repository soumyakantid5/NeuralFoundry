const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const {isValidName,isValidEmail,isValidRequest,isValidValue} = require("../utils/validator");
const saltRounds = 10;


//----------------------------------USER-Sign Up --------------------------------//

const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      //Request Validation
      if (!isValidRequest(req.body)) {
        return res.status(400).send({ Status:'Failed', Message:"Please fill the details" });
      }

      //Name Validation
      if (!isValidValue(name)) {
        return res.status(400).send({ Status:'Failed', Message:"Please enter your Name" });
      }
      if (!isValidName(name)) {
        return res.status(400).send({ Status:'Failed', Message:"Enter your name properly" });
      }

      //Email Validation & Duplicate Checking
      if (!isValidValue(email)) {
        return res.status(400).send({ Status:'Failed', Message:"Please enter your email"});
      }
      if (!isValidEmail(email)) {
        return res.status(400).send({ Status:'Failed', Message:"Email is not valid"});
      }

      const emailExist = await userModel.findOne({ email });
      if (emailExist) {
        return res.status(400).send({ Status: 'Failed', Message: "This email already exists" });
      }

      //Password Validation
      if (!password || password.length < 8 || password.length > 15){
        return res.status(400).send({ Status:'Failed', 
        Message:"Password length should be between 8 to 15" });
      }
      if(req.body.password.trim().length!==req.body.password.length){
        return res.status(400).send({ Status:'Failed', Message:"Space not allowed in Password" });
      }
      
      req.body.password = await bcrypt.hash(password, saltRounds);    //Password Hashing
      let newUser = await userModel.create(req.body);

      newUser=newUser.toObject();
      delete newUser.password;

      return res.status(201).send({ Status: 'Success', 'User Details': newUser });
    } 
    catch (error) {
      res.status(500).send({ Status: 'Failed', Message: error.message });
    }
  };
  


  //----------------------------------USER-Sign In --------------------------------//
  
  const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      //Request Validation
      if (!isValidRequest(req.body)) {
      return res.status(400).send({ Status: 'Failed', Message:"Enter email & password" });
      }

      //Email Validation
      if (!isValidValue(email)){ 
      return res.status(400).send({ Status: 'Failed', Messgage: "Enter your Email" });
      }
      
      const checkUser = await userModel.findOne({ email });
      if (!checkUser) {
        return res.status(404).send({ Status:'Failed', Message: "Email not found"});
      }
      
      //Password Validation
      if (!isValidValue(password)) {
        return res.status(400).send({ Status: 'Failed', Messsge: "Enter Password to login"});
      }
  
      let decryptPassword = await bcrypt.compare(password, checkUser.password);
      if (!decryptPassword) {
        return res.status(401).send({ Status: 'Failed', Message: "Password is not correct" });
      } 
     

      //TOKEN CREATION

      const currTimeStamp = Date.now();
      const createTime = Math.floor(currTimeStamp / 1000);
      const expTime = createTime + (12*60*60);
  
      const token = jwt.sign(
        {
          userId: checkUser._id.toString(),
          iat: createTime,
          exp: expTime,
        },
        process.env.JWT_TOKEN
      );
  
      res.setHeader("x-api-key", token);
      return res.status(200).send({ Status: "Success", Token: token });
    } 
    catch (error) {
      res.status(500).send({ Status: 'Failed', Message: error.message });
    }
  };
  



  //----------------------------------USER-Profile Update --------------------------------//

const updateUser = async (req,res) => {
    try {
      const { name, email, password } = req.body;

      //Request Validation
      if (!isValidRequest(req.body)) {
        return res.status(400).send({ Status:'Failed', Message:"Nothing to update" });
      }
      
      //Name Validation
      if(Object.keys(req.body).includes('name')){
        if (!isValidValue(name)) {
          return res.status(400).send({ Status:'Failed', Message:"Please enter your Name" });
        }
        if (!isValidName(name)) {
          return res.status(400).send({ Status:'Failed', Message:"Enter your name properly" });
        }
      }

      //Email Validation
      if(Object.keys(req.body).includes('email')){
        if (!isValidValue(email)) {
          return res.status(400).send({ Status:'Failed', Message:"Please enter your email"});
        }
        if (!isValidEmail(email)) {
          return res.status(400).send({ Status:'Failed', Message:"Email is not valid"});
        }
        let emailExist = await userModel.findOne({ email });
        if (emailExist) {
          return res.status(400).send({ Status: 'Failed', Message: "This email already exists" });
        }
      }

      //Password Validation
      if(Object.keys(req.body).includes('password')) {
        if (password.length < 8 || password.length > 15) {
          return res.status(400).send({ Status:'Failed', 
            Message:"Password length should be between 8 to 15" });
        }

        if(req.body.password.trim().length!==req.body.password.length) {
          return res.status(400).send({ Status:'Failed', Message:"Space not allowed in Password"});
        }
        
        //Hashing Password
        req.body.password = await bcrypt.hash(password, saltRounds);  
      }

      await userModel.findByIdAndUpdate({ _id: req.userId }, req.body, { new: true });
      return res.status(200).send({ Status: "Success", "Message":'User Profile Updated' });
    } 
    catch (error) {
      res.status(500).send({ Status: 'Failed', Message: error.message });
    }
}



  //----------------------------------USER-Profile Delete --------------------------------//

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    //USER-ID Validation
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ Status: "Failed", Message: "UserId is not a valid Id" });
    }

    const userData = await userModel.findOne({ _id: userId });
    if (!userData) {
      return res.status(404).send({ Status: "Failed", Message: "User Id is not correct" });
    }

    //Authorization Check
    if (req.userId !== userData._id.toString()) {
      return res.status(403).send({Status: "Failed",
          Message: "You're not allowed to delete this account",});
    }

    //Permanently deleting User account. Ideally we use a flag isDeleted to just hide the account.
    await userModel.findByIdAndRemove({ _id: userId });
    return res.status(204).send({ Status: "Success" });
  } 
  catch (error) {
    res.status(500).send({ Status: "Failed", Message: error.message });
  }
};



  module.exports= {register, login, updateUser, deleteUser};
  
  