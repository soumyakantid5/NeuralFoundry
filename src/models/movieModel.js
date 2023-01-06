const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    movie_id:Number,
    title:{
        type:String,
        lowercase:true,
    },
    poster_path:String,
    overview:String,
    popularity:Number,
    release_date:String,
},
{versionKey:false,timestamps:false}
);

module.exports = mongoose.model("Movie", movieSchema);