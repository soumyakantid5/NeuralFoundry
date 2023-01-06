const express = require('express')
const router = express.Router()

const {register,login} = require("../controllers/userController");
const {auth} = require("../middleware/auth")

router.post("/register", register);
router.post("/login", login);




//if api is invalid OR wrong URL
router.all("*", (req, res) =>
    res.status(404).send({
        status: false,
        message: "The api you requested is not available"
    })
)


module.exports = router