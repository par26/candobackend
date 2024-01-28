/** 
* Company model
/**@module UserModel 
*/
const mongoose = require("mongoose");

/**
 *Represents an user in the system.
 *@typedef {Object} Company
 *@property {string} name - The name of the company.
 *@property {Array.<mongoose.Schema.Types.ObjectId>} event - An array of company object ids.
 *@property {string} email - The email of the user.
 *@property {Array.String} resources - The different resources the company has
 *@property {string} location
 */

const companySchema = new mongoose.Schema({
    name: { type: String, required: true, maxLength: 100 },

    type: [{ type: String }],

    image: { type: String },

    description: { type: String },

    location: { type: String, maxLength: 300 },

    phoneNumber: { type: String },

    email: { type: String },

    //contacts: [{type:}],
    //students: [{type: Schema.Types.ObjectId, ref: "Student"}],
    //classId: {type: String, required: true},
    //event: [{type: Schema.Types.ObjectId, ref: "Event"}],
    resources: [{ type: String }],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

companySchema.index(
    { name: "text", type: "text", description: "text" },
    {
        weights: {
            name: 5,
            type: 4,
            description: 2,
        },
    }
);

//exports the user module
module.exports = mongoose.model("Company", companySchema);
