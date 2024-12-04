const express = require("express");
const mongoose = require("mongoose");
const bcryptjs =require("bcryptjs")
const jwt=require("jsonwebtoken")
const {router}=require("./router/router.js")
const {middleware}=require("./middlewares/middleware")
const app = express();
app.use(express.json());
app.use("" , router)
const PORT = 4000;

mongoose
  .connect("mongodb://localhost:27017/practice_exam")
  .then((data) => {
    console.log("Db is connected ");
  })
  .catch((err) => console.log("err is : ", err));

const userSchema = mongoose.Schema({
  name: {
    type: String,
   

  },
  email: String,
  password: String,

});

const userModel = mongoose.model("usermodel", userSchema);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

app.get("/home",middleware, (req, res) => {
  res.send("hello this is home page");
});

app.post("/create",async(req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  const user = new userModel({
    name,
    email,
    password,
  });
  await user.save();
  res.send({
    message: "user created successfully",
    user: user,
  });
});

app.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("id is :", id);
    const data = await userModel.findOne({ _id: id });
    // console.log("data is " , data)
    res.send({
      message: "user data is ",
      data: data,
    });
  } catch (error) {
    res.send({
      message: "error is ",
      error: error,
    });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findOne({ _id: id });
    user.deleteOne().then(() => {
      res.send({
        message: "user deleted successfully",
        user: user,
      });
    });
  } catch (error) {
    res.send({
      message: "error is ",
      error: error,
    });
  }
});
app.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.updateOne(
      { name: "ritesh chauhan" },
      { password: "123" }
    );
    res.send({
      message: "user updated successfully",
      user: user,
    });
  } catch (error) {
    res.send({
      message: "error is ",
      error: error,
    });
  }
});

//Authentication and authorization
//basic auth checking
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await userModel.findOne({ email });
//   if (!email || !password) {
//     res.send({
//       message: "invalid email or invalid password",
//     });
//   }
//   if (user.password == password) {
//     res.send({
//       message: "login successfully",
//       success: true,
//     });
//   }
//   res.send({
//     message: "invalid email or invalid password",
//   });
// });
//using jsonwentoken create token for next login auth with this and also do password hashing using bcryptjs and save this hash password inside database
//if user send data of login first find the email id present or not in db if yes then find that
//now hash the password that you get from frontend and then after verify it using dn hash password if matched then cretae jsonwebtoken and send back this inside response so that user can save this token in local storage
//if again it gives you request then first check token is present or not if yes then verify that token using secret key if all good then allow access
app.post("/login", async (req, res) => {
  try {
    console.log("login")
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.send({
        message: "invalid email",
      });
    }
    //comparing the password with hashpassword saved one
    console.log("isMatch")
    const isMatch=await bcryptjs.compare(password , user.password)
    console.log(isMatch)
    if(!isMatch){
      res.send({
        message: "invalid email or invalid password",
        success:false
      })
    }
    res.send({
      message: "login successfully",
      success:true
    })
    
  } catch (error) {
    res.send({
      message: "error is ",
      error: error,
    });
  }
});

//signup

app.post("/signup"  , async(req, res)=>{
  try {
    const{email , password}=req.body;
    const salt= await bcryptjs.genSalt(10);
   console.log("salt is " , salt)
    const hashpswd=await bcryptjs.hash(password , salt )
    console.log("pswdhash is " , hashpswd)
    const user=await userModel.create({
      email,
      password :hashpswd

    })
    //after saving data in db generate webtoken and send back to frontend
    const token= await jwt.sign({email:email} , "secretKey" )
    res.send({
      message: "signup successfully",
      success: true,
      user:user,
      token:token
    })

    
  } catch (error) {
   res.send({
    message:"error is ",
    error:error,
    success:false
   }) 
  }
})