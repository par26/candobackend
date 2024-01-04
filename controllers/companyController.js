import { Admin } from "../models/adminModel";
import { Company } from "../models/companyModel";


exports.company_create_post = async (req, res) => {
    
  var tags = req.body.tags;

  var contacts = req.body.contacts;

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

exports.company_edit_post = async (req, res) => {


  const company = new Company ({
    name: req.body.name,
        
    type: tags,

    location: req.body.location,

    
  });

  Company.findByIdAndUpdate(req.params.companyID, company, function(err, comp) {
    if(err) {
      return res.status(500).send(err)
    }
  });

}


exports.company_getAll = async (req, res) => {
  Admin.findById(req.admin._id, async function(err, admin) {

    var companies= [];
    
    if (err) {
      res.send(err)
    } else {

      if(admin.companies) {
         //loops through all the events in the admin's events array
        for(var i = 0; i < admin.companies.length; i++) {
            //finds the event object and stores it into student variable
            const company = await Company.findById(admin.companies[i]).exec();
            //adds the event variable to the array
            companies.push(company);
          }

        
      }
      
      res.json(companies);
    
    }
  })
  
}


exports.company_get = async (req, res) => {
  Company.findById(req.params.companyID, async function(err, company) {
      if(err) {
        res.send(err)
      } else {
        res.json(company)
      }
  })
}




exports.search_company = async (req, res) => {
  let seachString = req.query.searchString
  let filter = req.query.filters
  //wait until the distance was implemented for the req,query.distance
  let distance = req.query.distance



  Company.find({$text: {
    $search: seachString,
    $caseSensitive: false, 
  }}).exec(function(err, companies) {
    if(err) {
      res.status(500).send(err);
    } else [
      res.json(companies)
    ]
  });
 
};