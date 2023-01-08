const axios = require("axios");
const mongoose = require("mongoose");
const reviewModel = require("../models/reviewModel");
const movieModel = require("../models/movieModel");
const { isValidRequest, isValidValue } = require("../utils/validator");



//----------------------------------Create Review --------------------------------//

const createReview = async (req, res) => {
  try {
    let { review, rating, message, movie } = req.body;

    //Request Validation
    if (!isValidRequest(req.body)) {
      return res.status(400).send({ Status: "Failed", Message: "Please fill the details" });
    }

    //Review Validation
    if (!isValidValue(review)) {
      return res.status(400).send({ Status: "Failed", Message: "Review field can not be blank" });
    }

    //Rating Validation
    if (!rating || isNaN(rating) || (rating < 1 || rating > 5)) {
      return res.status(400).send({ Status: "Failed",Message: "Rate movie from 1 to 5" });
    }

    //Movie Name Validation
    if (!isValidValue(movie)) {
      return res.status(400).send({ Status: "Failed", Message: "Please enter movie name" });
    }

    movie = movie.trim().toLowerCase();
    //Checking if movie record is present in local DB
    let movieRecord = await movieModel.findOne({ title: movie });

    //If movie found in DB
    if (movieRecord) {
      req.body.movie = movieRecord._id;
      req.body.reviewdBy = req.userId;
      
      let reviewData = await reviewModel.create(req.body);  //Review Created

      return res.status(201).send({ Status: "Success","User Review": reviewData,
        "Movie Details": movieRecord });
    }

    //If movie not found in DB, then call API
    let response = await axios.get(`${process.env.BASE_URL}?api_key=${process.env.API_KEY}&query=${movie}`);

    //If movie not found in cloud
    if (response.data.results.length == 0) {
      return res.status(404).send({Status: "Failed",
          Message: "No record found.Try with different movie name" });
    }

    //If movie found from API call
    const items = response.data.results;
    let index = 0;

    //This loop ensures that we get the correct movie from the returned list of movies
    for (; index < items.length; index++) {
      if (movie == items[index].title.toLowerCase()) break;
    }

    //If No exact match found from the list of movies
    if (index == items.length) {
      return res.status(404).send({Status: "Failed",Message: "No record found" });
    }

    //If match found from the list of movies
    const movie_record = items[index];
    movie_record.poster_path = process.env.POSTER_URL + movie_record.poster_path;

    const movieData = await movieModel.create(movie_record);  //Storing Movie record in DB

    req.body.movie = movieData._id;
    req.body.reviewdBy = req.userId;

    const reviewData = await reviewModel.create(req.body);      //Storing Review 

    return res.status(201).send({ Status: "Success", "User Review": reviewData,
      "Movie Details": movieData });
  } 
  catch (error) {
    res.status(500).send({ Status: "Failed", Message: error.message });
  }
};





//--------------------------------Get All Reviews [By logged in User] -------------------------//

const getReview = async (req, res) => {
  try {
    //Fetching logged in User's Reviews
    let reviewData = await reviewModel.find({ reviewdBy: req.userId })
      .select({ _id: 0, reviewdBy: 0, createdAt: 0, updatedAt: 0 })
      .populate("movie", { movie_id: 1, title: 1, _id: 0 });

    //If no record found
    if (!reviewData.length) {
      return res.status(404).send({ Status: "Failed", Message: "No review found" });
    }

    //If rocord found
    return res.status(200).send({ Status: "Success", "Review Data": reviewData });
  } 
  catch (error) {
    res.status(500).send({ Status: "Failed", Message: error.message });
  }
};





//--------------------------------Edit Reviews [By Authorized User] -------------------------//

const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    //Checking Id
    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).send({ Status: "Failed", Message: "Review Id is not a valid Id" });
    }

    //Checking if Id found in DB
    let reviewData = await reviewModel.findOne({ _id: reviewId });
    if (!reviewData) {
      return res.status(404).send({ Status: "Failed", Message: "Review Id not found" });
    }

    //Authorization Check
    if (req.userId !== reviewData.reviewdBy.toString()) {
      return res.status(403).send({ Status: "Failed",
        Message: "You're not allowed to make the changes" });
    }

    let { review, rating, message, movie } = req.body;

    //Request Validation
    if (!isValidRequest(req.body)) {
      return res.status(400).send({ Status: "Failed", Message: "There is nothing to update" });
    }

    //Review Validation
    if (Object.keys(req.body).includes("review")) {
      if (!isValidValue(review)) {
        return res.status(400).send({ Status: "Failed", Message: "Review field can not be blank" });
      }
    }

    //Rating Validation
    if (Object.keys(req.body).includes("rating")) {
      if (!rating || isNaN(rating)) {
        return res.status(400).send({ Status: "Failed",Message: "Rating should be a Number" });
      }
      if (rating <= 0 || rating > 5) {
        return res.status(400).send({ Status: "Failed", Message: "Rate from 1 to 5" });
      }
    }

    //Movie name Can not be updated.If frontend part present,then no field will be there, then this check will no longer be needed
    if (Object.keys(req.body).includes("movie")) {
      return res.status(400).send({ Status: "Failed", Message: "Movie name can not be changed" });
    }

    //Updating Data
    let modifiedData = await reviewModel.findByIdAndUpdate({ _id: reviewId }, req.body,
      { new: true, upsert: true });

    return res.status(200).send({ Status: "Success", "Updated Review Data": modifiedData });
  } 
  catch (error) {
    res.status(500).send({ Status: "Failed", Message: error.message });
  }
};





//--------------------------------Delete Reviews [By Authorized User] -------------------------//

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    //ID Checking
    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).send({ Status: "Failed", Message: "Review Id is not a valid Id" });
    }

    //Checking Review ID
    const reviewData = await reviewModel.findOne({ _id: reviewId });
    if (!reviewData) {
      return res.status(404).send({ Status: "Failed", Message: "Review Id is not correct" });
    }

    //Authorization Check
    if (req.userId !== reviewData.reviewdBy.toString()) {
      return res.status(403).send({ Status: "Failed", Message: "You're not Authorized" });
    }

    //Permanently deleting Review. But we generally use a flag isDeleted to just hide the record.
    await reviewModel.findByIdAndRemove({ _id: reviewId });
    return res.status(204).send({ Status: "Success" });
  } 
  catch (error) {
    res.status(500).send({ Status: "Failed", Message: error.message });
  }
};

module.exports = { createReview, getReview, updateReview, deleteReview };
