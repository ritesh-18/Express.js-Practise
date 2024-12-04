const jwt =require("jsonwebtoken")


const middleware=async(req, res , next)=>{
    try {
        //extract token 
        const authHeader = req.headers.authorization;
        const token =authHeader.split(" ")[1];
        console.log(token)
        jwt.verify(token , "secretKey" , (err,user)=>{
            if(err){
                return res.status(401).json({message:"Invalid token"})
            }
            else{
                next();
            }
            
        })
    } catch (error) {
        res.send({
            status: false,
            message: "Error",
            error: error.message,

        })
    }
}
module.exports={middleware}