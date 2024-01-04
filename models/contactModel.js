const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const ContactSchema = Schema ({ 
    first_name: {type: String, required: true, maxLength: 100 },
    last_name: {type: String, required: true, maxLength: 100 },
    //students: [{type: Schema.Types.ObjectId, ref: "Student"}],
    //classId: {type: String, required: true},
    //event: [{type: Schema.Types.ObjectId, ref: "Event"}],
    email: {type: String, required: true},
  
    phone_number: {type: String},
  });
  
  
  
  //exports the admin module
  module.exports = mongoose.model("Contact", ContactSchema);