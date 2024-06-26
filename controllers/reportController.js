const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const hbs = require("handlebars");
const path = require("path");
const companyController = require("../controllers/companyController");
const catchAsync = require("../utils/catchAsync");
const Company = require("../models/companyModel");
const { Readable } = require("stream");
const { format } = require("date-fns");
const getCommonTags = require("../utils/getCommonTags");

const NUM_TAGS_TO_DISPLAY = 7;

// Function to compile a Handlebars template with provided data
const compile = async function (templateName, data) {
    const filePath = path.join(process.cwd(), "public", `${templateName}.hbs`);
    const html = await fs.readFile(filePath, "utf8");

    return hbs.compile(html)(data);
};

/**
 * Handler to generate a PDF report of companies owned by the logged-in user
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
exports.generatePdf = catchAsync(async (req, res, next) => {
    // Fetch all companies owned by the logged-in user
    const companies = await Company.find({ owner: req.user._id });
    const companiesArray = companies.map(company => company.toObject());

    // Fetch top 5 most clicked companies owned by the logged-in user
    const topClickedCompanyDocuments = await Company.find({
        owner: req.user._id,
    })
        .sort({ amountClicked: -1 })
        .limit(5);

    // Extract names and click counts of the top clicked companies
    const topClickedCompanyNames = topClickedCompanyDocuments.map(c => c.name);
    const topClickedCompanyClicks = topClickedCompanyDocuments.map(
        c => c.amountClicked
    );

    const body = req.body;

    // Get common tags from the companies array, limited to NUM_TAGS_TO_DISPLAY
    const tags = getCommonTags(companiesArray, NUM_TAGS_TO_DISPLAY);

    // Launch a Puppeteer browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Prepare data to be passed to the template
    const data = {
        tagLabels: Array.from(tags.keys()),
        tagData: Array.from(tags.values()),
        topClickedCompanyNames,
        topClickedCompanyClicks,
        companies: companiesArray,
        formattedDate: format(new Date(), "MMMM do, yyyy"),
        ...req.body,
    };

    // Compile the Handlebars template with the provided data
    const content = await compile("reportTemplate", data);

    // Set the page content to the compiled HTML
    await page.setContent(content);

    // Generate a PDF from the page content
    const buffer = await page.pdf({
        format: "A4",
        printBackground: true,
    });
    await browser.close();

    // Create a readable stream from the PDF buffer
    const stream = Readable.from(buffer);

    // Set response headers to indicate that the response is a PDF file
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=quote.pdf");

    // Pipe the PDF buffer to the response
    stream.pipe(res);
});
