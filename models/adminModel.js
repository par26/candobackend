/** 
* Admin model
/**@module adminModel 
*/
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

/**rwr4rwr
 *Represents an admin in the system.
 *@typedef {Object} Admin
 *@property {string} first_name - The first name of the admin.
 *@property {string} last_name - The last name of the admin.
 *@property {string} classId - The id of the admin's class.
 *@property {Array.<mongoose.Schema.Types.ObjectId>} event - An array of company object ids.
 *@property {string} email - The email of the admin.
 *@property {string} password - The password of the admin.
 */

const adminSchema = new mongoose.Schema({
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

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);

    next();
});

adminSchema.methods.comparePasswords = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

adminSchema.methods.hasPasswordChangedAfter = function (jwtTimestamp) {
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

//exports the admin module
module.exports = mongoose.model("Admin", adminSchema);
