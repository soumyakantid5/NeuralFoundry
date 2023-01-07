const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    id:Number,

    title:{
        type:String,
        lowercase:true,
    },
    
    poster_path:String,

    overview:String,

    popularity:Number,

    release_date:String,
},
{ timestamps:false, versionKey:false }
);

module.exports = mongoose.model("Movie", movieSchema);