/** 
* Company model
/**@module adminModel 
*/
const mongoose = require("mongoose");


const Schema = mongoose.Schema;

/**
*Represents an admin in the system.
*@typedef {Object} Company
*@property {string} first_name - The first name of the admin.
*@property {string} last_name - The last name of the admin.
*@property {string} classId - The id of the admin's class.
*@property {Array.<mongoose.Schema.Types.ObjectId>} event - An array of company object ids.
*@property {string} email - The email of the admin.
*@property {string} password - The password of the admin.
*/

const CompanySchema = Schema ({
  name: {type: String, required: true, maxLength: 100 },
  
  type: [{type: String}],

  contacts: [],
  //students: [{type: Schema.Types.ObjectId, ref: "Student"}],
  classId: {type: String, required: true},
  //event: [{type: Schema.Types.ObjectId, ref: "Event"}],
  resources: [{type: String}],
  
  
});



//exports the admin module
module.exports = mongoose.model("Company", CompanySchema);

