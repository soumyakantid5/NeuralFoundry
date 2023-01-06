const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Please Fill up your review properly"],
    },
    rating: {
      type: Number,
      required: [true, "Rating should be between 1 to 5"],
      min: 1,
      max: 5,
    },
    message: {
      type: String,
    },
    movie: {
      type: ObjectId,
      ref: "Movie",
      required: [true, "Please Enter movie name "],
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
