const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    poster:{
        type:String,
    },
    description:{
        type:String,
    }
},
{versionKey:false,timestamps:true}
);

module.exports = mongoose.model("Movie", movieSchema);