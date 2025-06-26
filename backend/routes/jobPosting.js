const express=require("express");
const router = express.Router();
const Job = require("../models/jobDescription.js");
const User = require("../models/user.js");
const { uploadResume } = require("../cloudConfig.js");


// jobPosting.js
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

  try {
    const recruiterUser = await User.findOne({ name: req.session.user.name });

    if (!recruiterUser) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    const job = new Job({
      title,
      company,
      description,
      workType,
      requiredSkills,
      location,
      salary,
      recruiter: recruiterUser.name
    });

    await job.save();

    
    recruiterUser.jobPosted.push(job._id);
    await recruiterUser.save();

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

  

  router.get("/search", async (req, res) => {
  try {
    const { title,  workType } = req.query;

    const query = {};

    if (title) query.title = { $regex: title, $options: "i" };
    if ( workType) query. workType = { $regex: workType, $options: "i" };
    

    const jobs = await Job.find(query);
      console.log(jobs); 
    res.json(jobs); 
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.post("/apply/:jobId", uploadResume.single("resume"), async (req, res) => {
  if (!req.session.user) {
    req.flash("error", "Please login to apply");
    return res.redirect("/");
  }

  const { jobId } = req.params;
  const { name, email, phone } = req.body;
  const resumeUrl = req.file?.path;

  try {
    const user = await User.findOne({ email: req.session.user.email });

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/");
    }

    const job = await Job.findById(jobId);
    if (!job) {
      req.flash("error", "Job not found");
      return res.redirect("/");
    }

    // Pushing the  applicant details
    job.applicants.push({
      developer: user._id,
      resumeUrl,
      appliedAt: new Date(),
    });

    await job.save();

    req.flash("success", "Successfully applied to the job!");
    res.redirect("/");
  } catch (error) {
    console.error("Error applying to job:", error);
    req.flash("error", "Something went wrong while applying.");
    res.redirect("/");
  }
});



module.exports = router;