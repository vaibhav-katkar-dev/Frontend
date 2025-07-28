const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  type: String,
  label: String,
  placeholder: String,
  required: Boolean,
  options: [String]
});

const formSchema = new mongoose.Schema({
  title: String,
  description:Number,
  fields: [fieldSchema]
});

module.exports = mongoose.model("Form", formSchema);
