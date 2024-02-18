const puppeteer = require('puppeteer')
const fs = require('fs')
const hbs = require('handlebars')
const path = require('path')
const companyController = require("../controllers/companyController");


const compile = async function (templateName, data) {
    const filePath = path.join(process.cwd(), 'public', '${templateName}.hbs');
    const html = await fs.readFileSync(filePath, 'utf8');
    return hbs.compile(html)(data);
}



exports.generatePdf = catchAsync(async (req, res, next) => {

    const userName = req.user.firstName;
    const pdfPath = path.join(process.cwd(), 'public', `${userName}.pdf`);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const content = await compile('reportTemplat');

    const data = await companyController.getAllCompanies(req, res, next);
 
    await page.setContent(content, data);
    await page.emulateMedia('screen');

    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
    });

    console.log('generated  PDF file');

    await browser.close();

    res.download(pdfPath)

    //SEE IF YOU NEED TO END PROCESS

});