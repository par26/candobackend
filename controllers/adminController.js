import Admin from './models/adminModel';



//the admin create post request
exports.admin_create_post = async (req, res) => {   
    
    var fod;

    var adminModel = new Admin({
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      classId: classId,
    });
    
    try {
        await newMember.save();
        res.status(200).send("Member created successfully");
        console.log("Request handled successfully");
    } catch (err) {
        if (err.code === 11000 && (err.keyPattern.email)) {
            res.status(400).send("Email address already used.");
        }
        else if (err.code === 11000 && (err.keyPattern.phone)) {
            res.status(400).send("Phone number already used.");
        } 
        else {
            res.status(500).send("Error saving member");
        }
    }
}
    
 


