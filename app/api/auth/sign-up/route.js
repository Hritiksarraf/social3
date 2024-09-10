import User from "@lib/models/User";
import { connectToDB } from "@lib/mongodb/mongoose";
var CryptoJS = require("crypto-js");

export const POST = async (req) => {
  try {
    await connectToDB();
    
    
    // Parse request body
    const { name, email, password, firstname,lastname, address,pincode,collage,username } = await req.json();
    
    let u = new User({
      firstName: firstname,
      lastName: lastname,
      email: email,
      address:address,
      pinCode:pincode,
      collageName:collage,
      userName:username,
      password: CryptoJS.AES.encrypt(password, "secret123").toString(),
    });

    await u.save();

    return new Response(JSON.stringify({ success: "success" }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "user can not be registered" }), { status: 500 });
  }
};
