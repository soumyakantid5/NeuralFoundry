const express = require('express');
const router = express.Router();

const {register, login} = require("../controllers/userController");

const {createReview, getReview, updateReview} = require("../controllers/reviewController");

const {getMovieReviewsByAllUsers} = require("../controllers/movieController");

const {auth} = require("../middleware/auth");

//User Controller
router.post("/register", register);
router.post("/login", login);

//Review Controller
router.post("/createreview",auth,createReview);
router.get("/getreview",auth,getReview);
router.put("/updatereview/:reviewId",auth,updateReview);

//Movie Controller
router.get("/:movie",getMovieReviewsByAllUsers);


//if api is invalid OR wrong URL
router.all("*", (req, res) =>
    res.status(404).send({status: false,message: "The api you requested is not available"})
);


module.exports = router;