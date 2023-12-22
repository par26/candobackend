import Admin from './models/adminModel';



//the admin create post request
exports.admin_create_post = async (req, res) => {   
    
    var fod;

    var adminModel = new Admin({
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      //classId: classId,
    });
    
    try {
        await adminModel.save();
        res.status(200).send("Member created successfully");
        console.log("Request handled successfully");
    } catch (err) {
        res.status(400).send("Error saving member");
    }
}
    
 


