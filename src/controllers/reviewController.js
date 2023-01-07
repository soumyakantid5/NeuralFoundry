const axios = require("axios");
const mongoose = require("mongoose");
const reviewModel = require("../models/reviewModel");
const movieModel = require("../models/movieModel");
const { isValidRequest, isValidValue } = require("../utils/validator");

const API_KEY = "231b38601ccd0b4ba999c87415f28a9c";
const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";

//----------------------------------Create Review --------------------------------//

const createReview = async (req, res) => {
  try {
    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ Status: "Failed", Message: "Please fill the details" });
    }

    let { review, rating, message, movie } = req.body;
    movie = movie.trim().toLowerCase();

    if (!isValidValue(review)) {
      return res
        .status(400)
        .send({ Status: "Failed", Message: "Review field can not be blank" });
    }

    if (!rating || isNaN(rating)) {
      return res.status(400).send({
        Status: "Failed",
        Message: "Please enter movie rating in Number",
      });
    }

    if (rating <= 0 || rating > 5) {
      return res
        .status(400)
        .send({ Status: "Failed", Message: "Rate from 1 to 5" });
    }

    if (!isValidValue(movie)) {
      return res
        .status(400)
        .send({ Status: "Failed", Message: "Please enter movie name" });
    }

    let movieRecord = await movieModel.findOne({ title: movie });

    if (movieRecord) {
      req.body.movie = movieRecord._id;
      req.body.reviewdBy = req.userId;
      let reviewData = await reviewModel.create(req.body);
      return res.status(201).send({
        Status: "Success",
        "User Review": reviewData,
        "Movie Details": movieRecord,
      });
    }

    let response = await axios.get(`${BASE_URL}?api_key=${API_KEY}&query=${movie}`);

    if (response.data.results.length == 0) {
      return res
        .status(404)
        .send({
          Status: "Failed",
          Message: "No record found.Try with different movie name",
        });
    }

    let items = response.data.results;
    let index = 0;

    for (; index < items.length; index++) {
      if (movie == items[index].title.toLowerCase()) break;
    }

    if (index == items.length) {
      return res
        .status(404)
        .send({
          Status: "Failed",
          Message: "No record found.Please check movie name.",
        });
    }

    const movie_record = items[index];
    movie_record.poster_path = POSTER_URL + movie_record.poster_path;

    const movieData = await movieModel.create(movie_record);

    req.body.movie = movieData._id;
    req.body.reviewdBy = req.userId;

    let reviewData = await reviewModel.create(req.body);

    return res.status(201).send({
      Status: "Success",
      "User Review": reviewData,
      "Movie Details": movieData,
    });
  } catch (error) {
    res.status(500).send({ Status: "Failed", Message: error.message });
  }
};



//--------------------------------Get All Reviews [By logged in User] -------------------------//

const getReview = async (req, res) => {
  try {
    let reviewData = await reviewModel
      .find({ reviewdBy: req.userId })
      .select({ _id: 0, reviewdBy: 0, createdAt: 0, updatedAt: 0 })
      .populate("movie", { movie_id: 1, title: 1, _id: 0 });

    if (!reviewData.length) {
      return res
        .status(404)
        .send({ Status: "Failed", Message: "No review found" });
    }

    return res
      .status(201)
      .send({ Status: "Success", "Review Data": reviewData });
  } catch (error) {
    res.status(500).send({ Status: "Failed", Message: error.message });
  }
};



//--------------------------------Edit Reviews [By Authorized User] -------------------------//

const updateReview = async (req, res) => {
  try {
    let reviewId = req.params.reviewId;

    if (!mongoose.isValidObjectId(reviewId)) {
      return res
        .status(400)
        .send({ Status: "Failed", Message: "Review Id is not a valid Id" });
    }

    let reviewData = await reviewModel.findOne({ _id: reviewId });

    if (!reviewData) {
      return res
        .status(404)
        .send({ Status: "Failed", Message: "Review Id is not correct" });
    }

    if (req.userId !== reviewData.reviewdBy.toString()) {
      return res
        .status(403)
        .send({
          Status: "Failed",
          Message: "You're not allowed to make the changes",
        });
    }

    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ Status: "Failed", Message: "There is nothing to update" });
    }

    let { review, rating, message, movie } = req.body;

    if (Object.keys(req.body).includes("review")) {
      if (!isValidValue(review)) {
        return res
          .status(400)
          .send({ Status: "Failed", Message: "Review field can not be blank" });
      }
    }

    if (Object.keys(req.body).includes("rating")) {
      if (!rating || isNaN(rating)) {
        return res.status(400).send({
          Status: "Failed",
          Message: "Please enter movie rating in Number",
        });
      }
      if (rating <= 0 || rating > 5) {
        return res
          .status(400)
          .send({ Status: "Failed", Message: "Rate from 1 to 5" });
      }
    }

    if (Object.keys(req.body).includes("movie")) {
      return res
        .status(400)
        .send({ Status: "Failed", Message: "Movie name can not be changed" });
    }

    let modifiedData = await reviewModel.findByIdAndUpdate(
      { _id: reviewId },
      req.body,
      { new: true, upsert: true }
    );

    return res
      .status(200)
      .send({ Status: "Success", "Updated Review Data": modifiedData });
  } catch (error) {
    res.status(500).send({ Status: "Failed", Message: error.message });
  }
};

//--------------------------------Delete Reviews [By Authorized User] -------------------------//

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    if (!mongoose.isValidObjectId(reviewId)) {
      return res
        .status(400)
        .send({ Status: "Failed", Message: "Review Id is not a valid Id" });
    }
    const reviewData = await reviewModel.findOne({ _id: reviewId });

    if (!reviewData) {
      return res
        .status(404)
        .send({ Status: "Failed", Message: "Review Id is not correct" });
    }

    if (req.userId !== reviewData.reviewdBy.toString()) {
      return res
        .status(403)
        .send({
          Status: "Failed",
          Message: "You're not allowed to make the changes",
        });
    }

    await reviewModel.findByIdAndRemove({ _id: reviewId });
    return res.status(204).send({ Status: "Success" });
  } 
  catch (error) {
    res.status(500).send({ Status: "Failed", Message: error.message });
  }
};

module.exports = { createReview, getReview, updateReview, deleteReview };
