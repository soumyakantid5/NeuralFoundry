const jwt = require("jsonwebtoken");

module.exports.auth = (req, res, next) => {
  try {
   
    if (!req.headers.authorization) {
      return res.status(401).send({ Status: 'Failed',
          Message: "Missing authentication token in request ",
        });
      }

    let token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(401).send({ Status: 'Failed',
          Message: "Invalid authentication token in request headers ",
        });
    }

    if (Date.now() > decoded.exp * 1000) {
      return res.status(401).send({ Status: 'Failed',
          Message: "Session expired! Please login again ",
        });
    }

    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded)=> {
      if (err) return res.status(401).send({ status: 'Failed', Message: "Invalid Token" });
      else {
        req.userId = decoded.userId;
        return next();
      }
    });
  } 
  catch (error) {
    res.status(500).send({ Status: 'Failed', Message: error.message });
  }
};
