const express=require("express")
const {home} =require("../controller/controller")
const router = express.Router()

//now using router we can create that router and attach with controller 
router.get("/" , home)
module.exports={router}
