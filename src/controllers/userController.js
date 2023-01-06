const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

//---------------------------------------------USER-Sign Up -----------------------------------------

let register = async (req, res)=> {
    try {
      let data = req.body;
      const { name, email, password } = data;
      
      let newUser = await userModel.create(data);
      return res.status(201).send({ Status: 'Success', 'User Details': newUser });
    } 
    catch (error) {
      res.status(500).send({ Status: 'Failed', Message: error.message });
    }
  };
  

  //---------------------------------------------USER-Sign In -----------------------------------------
  
  let login = async function (req, res) {
    try {
  
      let data = req.body;
      const { email, password } = data;
  
      let checkedUser = await userModel.findOne({
        email: email,
        password: password,
      });
  
      if (!checkedUser) {
        return res.status(401).send({ Status: 'Failed', Message: "email or password is not correct" });
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
      res.status(500).send({ Status: 'Failed', message: error.message });
    }
  };
  
  module.exports= {register,login};
  
  