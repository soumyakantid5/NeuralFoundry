const mongoose = require("mongoose");
const ObjectId= mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    message:{
        type:String,
    },
    movie:{
        type:ObjectId,
        ref:'Movie',
    }
},
{versionKey:false,timestamps:true}
);

module.exports = mongoose.model("Review", reviewSchema);