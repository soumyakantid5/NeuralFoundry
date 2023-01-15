const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");

const { register, login, updateUser, deleteUser, forgotPassword, verifyOtp } = require("../controllers/userController");

const {createReview,getReview,updateReview,deleteReview} = require("../controllers/reviewController");

const { getMovieReviewsByAllUsers } = require("../controllers/movieController");

//User Controller
router.post("/register", register);
router.post("/login", login);
router.put("/updateUser", auth, updateUser);
router.delete("/deleteUser/:userId", auth, deleteUser);
router.post("/forgotPassword",forgotPassword);
router.post("/verifyotp",verifyOtp)

//Review Controller
router.post("/createreview", auth, createReview);
router.get("/getreview", auth, getReview);
router.put("/updatereview/:reviewId", auth, updateReview);
router.delete("/deletereview/:reviewId", auth, deleteReview);

//Movie Controller
router.get("/:movie", getMovieReviewsByAllUsers);

//If user try to search home page [ without any specfic route]
router.all("/", (req,res) => {
    return res.status(200).send({ Status: "HELLO.NICE TO SEE YOU HERE. " ,
    Message:" TRY SPECIFIC ROUTES TO SIGN UP, SIGN IN, CREATE-READ-UPDATE-DELETE REVIEW OR FETCH ALL REVIEWS FOR A PARTICULAR MOVIE" });
})

//if api is invalid OR wrong URL
router.all("*", (req, res) => {
    res.status(404).send({ Status: false, Message: "THE API YOU REQUESTED IS NOT AVAILABLE" })
    }
);

module.exports = router;