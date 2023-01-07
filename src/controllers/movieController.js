const movieModel = require("../models/movieModel");
const reviewModel = require("../models/reviewModel");


const getMovieReviewsByAllUsers = async (req, res) => {
  try {
    let movie = req.params.movie;
    let movieExists = await movieModel.findOne({ title: movie })

    if (movieExists) {
      let reviewData = await reviewModel.find({ movie: movieExists._id }).
      select({_id:0,movie:0,reviewdBy:0});

      if (reviewData.length > 0){
        return res.status(200).send({Status: "Success","User Review": reviewData,"Movie Details": movieExists,});
        }
      else return res.status(404).send({ Status: "Failed", Message: "No review found" });
    } 
    else return res.status(404).send({ Status: "Failed", Message: "Try with different movie name" });

  } 
  catch (error) {
    res.status(500).send({ Status: "Failed", Message: error.message });
  }
};

module.exports = { getMovieReviewsByAllUsers };
