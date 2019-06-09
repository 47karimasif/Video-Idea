
const jwt=require("jsonwebtoken")
const User=require("../models/user")

const auth=async(req,res,next)=>{
try{

  const token=req.cookies.token;
  const decoded=jwt.verify(token,process.env.JWT_SECRET)
  const user=await User.findOne({_id:decoded._id,"tokens.token":token})
  if(!user)
  {
    throw new Error
  }
  req.token=token
  req.user=user //passing the user which is accesing routes to that secured route
  next()
}catch(e)
{
  res.redirect("/signup")
}

}


module.exports=auth
