const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["recruiter", "developer"],
        required: true,
    },
    profilePhoto:{
        url:String,
        filename: String,

    },
    about: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "About", 
    }
    
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
