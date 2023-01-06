const mongoose = require('mongoose')

//request body validation
const isValidRequest = (value) => Object.keys(value).length > 0;

//value validation
const isValidValue = (value)=>{
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number") return false;
  return true;
};

//Number validation
const isValidNumber = (value)=>{
  if (Number(value) && value!== NaN) return true;
  return false;
};

//Name validation
const isValidName = (value)=> /^([\w]{2,})+\s+([\w\s]{2,})+$/i.test(value)

//Email validation
const isValidEmail = (value)=>/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)

const isValidObjectId = (value)=>mongoose.isValidObjectId(value)

module.exports={isValidRequest, isValidValue ,isValidNumber , isValidName, isValidEmail}