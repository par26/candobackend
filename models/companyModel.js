/** 
* Company model
/**@module adminModel 
*/
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 *Represents an admin in the system.
 *@typedef {Object} Company
 *@property {string} name - The name of the company.
 *@property {Array.<mongoose.Schema.Types.ObjectId>} event - An array of company object ids.
 *@property {string} email - The email of the admin.
 *@property {Array.String} resources - The different resources the company has
 *@property {string} location
 */

const companySchema = Schema({
    name: { type: String, required: true, maxLength: 100 },

    type: [{ type: String }],

    image: { type: String },

    description: { type: String },

    location: { type: String, required: false, maxLength: 300 },

    phoneNumber: { type: String },

    email: { type: String },

    //contacts: [{type:}],
    //students: [{type: Schema.Types.ObjectId, ref: "Student"}],
    //classId: {type: String, required: true},
    //event: [{type: Schema.Types.ObjectId, ref: "Event"}],
    resources: [{ type: String }],
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

//exports the admin module
module.exports = mongoose.model("Company", companySchema);
