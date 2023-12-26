import Admin from './models/adminModel';



//the admin create post request
exports.admin_create_post = async (req, res) => {   

    var adminModel = new Admin({
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      //classId: classId,
      phone_number: req.body.phone_number,
    });
    
    try {
        await adminModel.save();
       

        const access_token = Jwt.sign(admin._id, process.env.ACCESS_TOKEN_SECRET);
        
        res.json({access_token: access_token});
        console.log("Request handled successfully");
    } catch (err) {
        res.status(400).send("Error saving member");
    }
}



    
 


