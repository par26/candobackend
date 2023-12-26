import { Admin } from "../models/adminModel";
import { Company } from "../models/companyModel";


exports.company_create_post = async (req, res) => {
    
  var tags = req.body.tags;

  // Converts the tags into an array
  if(!Array.isArray(tags)) {
    if(typeof tags === "undefined") {
        tags = [];
    } else {
       tags = [req.body.tags];
    }

  } 

  //note: May need to add the resources later


    var companyModel = new Company ({
        name: req.body.name,
        
        type: tags,

        location: req.body.location,

        phone_number: req.body.phone_number,

        email: req.body.email,
    });


    companyModel.save((err, company) => {
        if (err) {
          return res.status(500).send(err)
        }
        // Successful 
        // Find the admin document by ID and append the new company id to the companies array
        Admin.findByIdAndUpdate(req.admin._id, { $push: {companies: company._id } }, { new: true })
        .exec((err, admin) => {
          if (err) {
            return res.status(500).send(err)
          } 
        });
  
      
    });
  


}