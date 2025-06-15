const express=require("express");
const router = express.Router();
const Job = require("../models/jobDescription.js");


router.post("/post-job", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Please login to post a job" });
    }
  
    const {
      title,
      company,
      description,
      workType,
      requiredSkills,
      location,
      salary,
    } = req.body;
  
    if (!title || !company || !description || !location || !workType || !requiredSkills || !salary) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    const job = new Job({
      title,
      company,
      description,
      workType,
      requiredSkills,
      location,
      salary,
      recruiter: req.session.user.name, 
    });
    console.log(req.session);
  
    await job.save();
    res.status(201).json({ message: "Job posted successfully", job });
  });
  

  router.get("/search", async (req, res) => {
  try {
    const { title, location, skills } = req.query;

    const query = {};

    if (title) query.title = { $regex: title, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (skills) query.requiredSkills = { $regex: skills, $options: "i" };

    const jobs = await Job.find(query);
      console.log(jobs); 
    res.json(jobs); 
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


module.exports = router;