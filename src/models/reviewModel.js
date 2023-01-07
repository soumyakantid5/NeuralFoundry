const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    review: {
      type: String,
      required: [true, "Please Fill up your review properly"],
      trim:true
    },
    rating: {
      type: Number,
      required: [true, "Rating should be between 1 to 5"],
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      default:'Not Available',
      trim:true
    },
    movie: {
      type: ObjectId,
      ref: "Movie",
      required: [true, "Please Enter movie name"],
    },
    reviewdBy:{
      type: ObjectId,
      ref: "User"
    },
  },
  { timestamps: true, versionKey: false  }
);

module.exports = mongoose.model("Review", reviewSchema);
