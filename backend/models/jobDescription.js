const mongoose = require("mongoose");
const User = require("./user.js");


const applicantSchema = new mongoose.Schema({
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});


const jobSchema = new mongoose.Schema({

  title:{
    type: String,
    required: true,
  },


  company:{
    type: String,
    required: true,
  },

  description:{
    type: String,
    required: true,
  },

  workType :{
    type: String,
    required: true,
  },

  requiredSkills: {
    type: String,
    required: true
  },
  location:{
    type: String,
    required: true,
  },

  salary:{
    type: String,
    reqired: true,
  },

  recruiter:{
    type: String,
    required: true,
  },

  applicants: {
    type: [applicantSchema],
    default: [],
  },

  postedAt:{
    type: Date,
    default: Date.now,
  }

});

module.exports = mongoose.model("Job", jobSchema);