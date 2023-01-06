const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const {isValidName,isValidEmail,isValidRequest,isValidValue} = require("../utils/validator");
const saltRounds = 10;
//----------------------------------USER-Sign Up --------------------------------//

let register = async (req, res)=> {
    try {
      if (!isValidRequest(req.body)){
        return res.status(400).send({ Status:'Failed', Message:"Please fill the details" });
      }
      const { name, email, password } = req.body;

      if (!isValidValue(name)){
        return res.status(400).send({ Status:'Failed', Message:"Please enter your Name"});
      }
      if (!isValidName(name)){
        return res.status(400).send({ Status:'Failed', Message:"Enter your name properly"});
      }

      if (!isValidValue(email)){
        return res.status(400).send({ Status:'Failed', Message:"Please enter your email"});
      }
      if (!isValidEmail(email)){
        return res.status(400).send({ Status:'Failed', Message:"Email format is not correct"});
      }
      let emailExist = await userModel.findOne({ email });
      if (emailExist){
        return res.status(400).send({ Status: 'Failed', Message: "This email already exists" });
      }

      if (password.length < 8 || password.length > 15){
        return res.status(400).send({ Status:'Failed', Message:"Password length should be between 8 to 15"});
      }
      req.body.password = await bcrypt.hash(password, saltRounds);

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
  
  let login = async function (req, res) {
    try {
  
      const { email, password } = req.body;

      if (!isValidRequest(req.body)) {
      return res.status(400).send({ Status: 'Failed', Message:"Enter email & password"});
      }
      if (!isValidValue(email)) 
      return res.status(400).send({ Status: 'Failed', Messgage: "Enter your Email" });
      
      let checkemail = await userModel.findOne({ email });
      if (!checkemail) return res.status(404).send({ Status:'Failed', Message: "Email not found"});
  
      if (!isValidValue(password)) {
        return res.status(400).send({ Status: 'Failed', Messsge: "Enter Password"})
      }
  
      let decryptPassword = await bcrypt.compare(password, checkemail.password);
      if (!decryptPassword) {
        return res.status(401).send({ Status: 'Failed', Message: "Password is not correct" });
      }
    
     
 /***************************GENERATE TOKEN**********************/
  
      let date = Date.now();
      let createTime = Math.floor(date / 1000);
      let expTime = createTime +( 60*60);
  
      let token = jwt.sign(
        {
          userId: checkedUser._id.toString(),
          iat: createTime,
          exp: expTime,
        },
        "neuralfoundry"
      );
  
      res.setHeader("x-api-key", token);
      return res.status(200).send({ Status: "Success", Token: token  });
    } 
    catch (error) {
      res.status(500).send({ Status: 'Failed', Message: error.message });
    }
  };
  
  module.exports= {register,login};
  
  