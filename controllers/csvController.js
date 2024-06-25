const fs = require("fs");
const path = require("path");
const companyController = require("../controllers/companyController");
const catchAsync = require("../utils/catchAsync");
const Company = require("../models/companyModel");
const { Readable } = require("stream");
const { format } = require("date-fns");
const {Parser} = require('json2csv');



function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.generateCSV = catchAsync(async (req, res, next) => {
    const companies = await Company.find({ owner: req.user._id });
    const companiesArray = companies.map(company => company.toObject());
   
    const body = req.body;

    const userName = req.user.firstName;

    const tags = await getCommonTags(companiesArray);


    const data = {
        companies: companiesArray,
    };


    const fileName = `${capitalizeFirstLetter(req.user.firstName)}_${capitalizeFirstLetter(req.user.lastName)}`;
    
    const fields = [
        {label: 'Company Name', value: 'name'},
        {label: 'Description', value: 'description'},
        {label: 'Email', value: 'email'},
        {label: 'Phone Number', value: 'phoneNumber'},
        {label: 'Resources', value: 'resources'},
        {label: 'Tags', value: 'type'},
    ]


    const json2csvParser = new Parser({ fields });

    // Parse the processed JSON data to CSV format
    const csv = await json2csvParser.parse(processedData);

    // Write the CSV string to a file
    await fs.writeFile('${fileName}.csv', csv, (err) => {
    if (err) {
      console.error('Error writing to CSV file', err);
    } else {
      console.log('CSV file has been successfully written');
    }
  });

     // Set response headers to indicate that the response is a CSV file
     res.setHeader('Content-Type', 'text/csv');
     res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
 
     // Send the CSV data as a response
    res.status(200).send(csv)

})


