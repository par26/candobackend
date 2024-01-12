/** 
* User model
/**@module userModel 
*/
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

/**rwr4rwr
 *Represents an user in the system.
 *@typedef {Object} User
 *@property {string} first_name - The first name of the user.
 *@property {string} last_name - The last name of the user.
 *@property {string} classId - The id of the user's class.
 *@property {Array.<mongoose.Schema.Types.ObjectId>} event - An array of company object ids.
 *@property {string} email - The email of the user.
 *@property {string} password - The password of the user.
 */

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please fill in your first name"],
        maxLength: 100,
    },
    lastName: {
        type: String,
        required: [true, "Please fill in your last name"],
        maxLength: 100,
    },
    //students: [{type: Schema.Types.ObjectId, ref: "Student"}],
    //classId: {type: String, required: true},
    //event: [{type: Schema.Types.ObjectId, ref: "Event"}],
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false,
    },
    phoneNumber: {
        type: String,
        validate: [
            validator.isMobilePhone,
            "Please provide a valid phone number",
        ],
        unique: true,
    },
    passwordLastChangedAt: Date,
    companies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);

    next();
});

userSchema.methods.comparePasswords = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.hasPasswordChangedAfter = function (jwtTimestamp) {
    if (this.passwordLastChangedAt) {
        const timestamp = Math.floor(
            this.passwordLastChangedAt.getTime() / 1000
        );

        // If the password is changed after the token was created, timestamp is going to be bigger than jwtTimestamp,
        // which this code under here will return true, meaning the password changed after the token was created.
        return jwtTimestamp < timestamp;
    }

    return false;
};

//exports the user module
module.exports = mongoose.model("User", userSchema);
