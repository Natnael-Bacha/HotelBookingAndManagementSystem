import Admin from "../models/admin.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export async function handleAdminSignup(req, res) {
  const {
    firstName,
    middleName,
    lastName,
    email,
    idNumber,
    password,
    confirmPassword,
  } = req.body;
  try {
    const admin = await Admin.findOne({ idNumber });
    if (password !== confirmPassword) {
      return res
        .status(404)
        .json({ message: "Sign up failed! please try again" });
    }
    if (admin) {
      return res
        .status(404)
        .json({ message: "Sign up failed! please try again" });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newAdmin = new Admin({
      firstName,
      middleName,
      lastName,
      email,
      idNumber,
      password: hashPassword,
    });
    await newAdmin.save();
    console.log("Signed up!!");
    return res.status(200).json({message: "Signed up successfull!"});
  } catch (error) {
    console.log("Error signing up: ", error)
    return res.status(400).json({message: "Signup FAILED!"});
  }
}

export async function handleAdminSignin(req, res) {
   
  const {idNumber, password} = req.body;

  try {
     const admin = await Admin.findOne({idNumber});
     if(!admin){
      console.log("Error signing in no admin");
        return res.status(404).json({message: "Error signing in!"})
     }
    
     const verifyPassword =  await bcrypt.compare(password, admin.password);
     if(!verifyPassword){
      console.log("Error signing in password");
      return res.status(404).json({message: "Error signing in!"})
     }

    const token = jwt.sign({firstName: admin.firstName, middleName: admin.middleName, lastName: admin.lastName, _id: admin._id }, process.env.KEY, {expiresIn: '24h'});
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: '/',
      maxAge: 1440 * 60 * 1000
    });
    return res.status(200).json({message: "Signed in successfully!"});
  } catch (error) {
    console.log("Error signing in", error);
    return res.status(404).json({message: "Error signing in!"});
  }


}
