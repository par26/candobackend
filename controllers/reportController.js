const puppeteer = require("puppeteer");
const fs = require("fs");
const hbs = require("handlebars");
const path = require("path");
const companyController = require("../controllers/companyController");
const catchAsync = require("../utils/catchAsync");
const Company = require("../models/companyModel");
const { Readable } = require("stream");



const compile = async function (templateName, data) {
    
    const filePath = path.join(process.cwd(), "public", `${templateName}.hbs`);
    const html = await fs.readFileSync(filePath, "utf8");

    return hbs.compile(html)(data);
};



exports.generatePdf = catchAsync(async (req, res, next) => {
    const companies = await Company.find({ owner: req.user._id });
    const body = req.body;
    console.log(body);

    const userName = req.user.firstName;

    const tags = await getTags(companies.map(company => company.toObject()));

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const content = await compile("reportTemplate", {
        // convert companies to js object
        data:  Array.from(tags.keys()),
        labels:  Array.from(tags.values()),
        companies: companies.map(company => company.toObject()),
        ...req.body,
    });

    await page.setContent(content);

    const buffer = await page.pdf({
        format: "A4",
        printBackground: true,
    });
    await browser.close();

    const stream = Readable.from(buffer);

    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
    stream.pipe(res);
});


const getTags = async function(companyData) {
    let tags = new Map();

    for(let company in companyData) {
        for(let key in company.type) {
        
            let companyTag = company.type[key];
    
            if(tags.get(companyTag) == undefined) {
                tags.set(companyTag, 1);
            } else {
                tags.set(companyTag, tags.get(companyTag)+1);
            }
        }
    
    }
    
    return tags;
};