const request = require("request");
const reviewModel = require("../models/reviewModel");
const movieModel = require("../models/movieModel");
const {isValidRequest,isValidValue} = require("../utils/validator");
const API_KEY='231b38601ccd0b4ba999c87415f28a9c';

//----------------------------------Create Review --------------------------------//

const createReview = async (req, res)=> {
  try {
    
    if (!isValidRequest(req.body)){
      return res.status(400).send({ Status:'Failed', Message:"Please fill the details" });
    }
    const {review,rating,message,movie} = req.body;
    
    if(!review){
      return res.status(400).send({ Status:'Failed', Message:"Review field can not be blank"});
    }
    if(!rating){
      return res.status(400).send({ Status:'Failed', Message:"Please enter movie rating"});
    }
    if(rating<=0 || rating>5){
      return res.status(400).send({ Status:'Failed', Message:"Rate from 1 to 5"});
    }
    if(!movie){
      return res.status(400).send({ Status:'Failed', Message:"Please enter movie name"});
    }

    request(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movie}`,
      async (error, response, body) => {
        if (error) {
          res.status(404).send({ Status: 'Failed', message: error.message });
        } 
        else {
          let data1 = JSON.parse(body);
          let items = data1.results[0];
          const title = items.title;
          const poster = items.poster_path;
          let description = items.overview;

          let movieData = await movieModel.create({
            title,
            poster,
            description,
          });
         
          req.body.movie = movieData._id;

          let reviewData = await reviewModel.create(req.body);

          return res.status(201).send({ Status: 'Success', 'User Review': reviewData, 
          'Movie Details':movieData });
        }
      }
    );
  } 
  catch (error) {
    res.status(500).send({ Status: 'Failed', Message: error.message });
  }
};


//----------------------------------Get Reviews --------------------------------//


const getReview = async (req, res) => {
  try {
   
  }
  catch (error) {
    res.status(500).send({ Status: 'Failed', Message: error.message });
  }
};

module.exports = { createReview, getReview };
