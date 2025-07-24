const express = require("express");
const router = express.Router();
const Job = require("../models/jobDescription.js");
const User = require("../models/user.js");
const { uploadResume } = require("../cloudConfig.js");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

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




router.post('/sendBulkEmails', async (req, res) => {
  const { candidates } = req.body;

  if (!Array.isArray(candidates)) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.PLATFORM_EMAIL,
        pass: process.env.PLATFORM_PASS,
      },
    });

    for (const candidate of candidates) {
      const { name, email, score } = candidate;
      const subject =
        score >= 85
          ? "🎉 Congratulations! You're Shortlisted"
          : "💼 Thank You for Applying";
      const text =
        score >= 85
          ? `Dear ${name},\n\nCongratulations! You have been shortlisted for the next round.\n\nBest regards,\nRecruitment Team`
          : `Dear ${name},\n\nThank you for applying. We encourage you to apply again in the future.\n\nGood luck!\nRecruitment Team`;

      if (email && email !== "unknown@example.com") {
        await transporter.sendMail({
          from: `"Recruitment Team" <${process.env.PLATFORM_EMAIL}>`,
          to: email,
          replyTo: process.env.RECRUITER_REPLY_TO || process.env.PLATFORM_EMAIL,
          subject,
          text,
        });
      }
    }

    res.status(200).json({ message: "✅ Emails sent successfully!" });
  } catch (err) {
    console.error("Email sending error:", err.message);
    res.status(500).json({ message: "Failed to send emails", error: err.message });
  }
});


// Search route (unchanged)
router.get("/search", async (req, res) => {
  try {
    const { title, workType } = req.query;
    const query = {};

    if (title) query.title = { $regex: title, $options: "i" };
    if (workType) query.workType = { $regex: workType, $options: "i" };

    const jobs = await Job.find(query);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Apply to job with resume upload (uses uploadResume)
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

    job.applicants.push({
      developer: user._id,
      resumeUrl,
      appliedAt: new Date(),
    });

    await job.save();

    console.log("Uploaded resume URL:", req.file?.path);

    req.flash("success", "Successfully applied to the job!");
    res.redirect("/");
  } catch (error) {
    console.error("Error applying to job:", error);
    req.flash("error", "Something went wrong while applying.");
    res.redirect("/");
  }
});

// Get job by ID
router.get("/:jobId", async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  res.json(job);
});

router.delete("/:jobId", async (req, res) => {
  const { jobId } = req.params;

  try {
    const deletedJob = await Job.findByIdAndDelete(jobId);
    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Server error while deleting job" });
  }
});

module.exports = router;
