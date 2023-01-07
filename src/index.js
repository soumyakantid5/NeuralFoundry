require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const route = require("./routes/route");
const app = express();

app.use(express.json());
app.use(multer().any());


mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URL, {useUnifiedTopology: true,useNewUrlParser: true,})
  .then(() => console.log("Database Connected successfully..."))
  .catch((error) => console.log(error));

  
app.use("/", route);
app.listen(process.env.PORT || 3000, () =>
  console.log("Server running on Port ", process.env.PORT || 3000)
);
