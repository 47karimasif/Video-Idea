
const express=require("express")
const router=new express.Router()
const User=require("../models/user")
const auth=require("../middleware/auth")
const multer=require("multer") //for uploading files

//for exporting errormessage fnctn from public file
const ERRORmessages=require("../js/errormsg")

//signup page
router.get("/login",async (req,res)=>{
  try{
    res.render("login")
  }catch(e)
  {
    res.send("Error 404! page not found")
  }
})
//register page
router.get("/signup",async (req,res)=>{
  try{
    res.render("signup")
  }catch(e)
  {
    res.send("Error 404! page not found")
  }
})

//register post data
router.post("/signup",async (req,res)=>{
  const newUser=new User(req.body)
  try{
    await newUser.save()
      res.redirect("/login")
  }catch(e)
  {
    const er1 = Object.keys(e.errors)
    const allerrormsg=ERRORmessages(e,er1)
    res.render("signup",{
      errors:allerrormsg
    })
  }
})
//for login
router.post("/login",async (req,res)=>{
try{
  const user=await User.findByCredentials(req.body.gmail,req.body.password)
  const token=await user.generateAuthToken()
  res.cookie('token', token, { httpOnly: true })
  res.redirect("/profile")
}catch(e)
{
const errormsg=[]
errormsg.push(e.message)
res.render("login",{
  errors:errormsg
})

}

})

// for login out
router.get("/logout",auth,async(req,res)=>{
  try{
    req.user.tokens=req.user.tokens.filter((token)=>{
      return token.token !==req.token  //if current token not match keep it there in array
    })
    await req.user.save()
    res.redirect("/login")
  }catch(e)
  {
  console.log(e)
  }
})

//user profile-page
router.get("/profile",auth,async (req,res)=>{
  try{
    res.render("logged-In",{
      user:req.user //since this is secured by auth we can acess all passed by auth middleware function
    })
  }catch(e)
  {
    console.log(e)
  }
})

// const upload=multer({
//   limits:{
//     fileSize:10000000  //10MB
//   },
//   fileFilter(req,file,cb){
//     if(!file.originalname.match(/\.(jpg|PNG)$/)) {
//     return cb( new Error("upload a image file"))
//   }
//     cb(undefined,true)
//   }
// })
//
// router.post("/upload",auth,upload.single("upload"),async(req,res)=>{
// req.user.Dp=req.file.buffer
// console.log(req.user.Dp)
// await req.user.save()
// res.redirect("/profile")
// },(error,req,res,next)=>{
//   res.send(error.message)
// })




module.exports=router
