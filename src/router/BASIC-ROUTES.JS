const express=require("express")
const router=new express.Router()
const Idea=require("../models/idea")
const auth=require("../middleware/auth")
//get index page
router.get("/",   (req,res)=>{

res.render("index",{
  title:"video-idea"
                   })
})

//get about page



router.get("/about",(req,res)=>{
res.render("about")
})

router.get("/allideas",async(req,res)=>{
  try{
 const allideas=await Idea.find({}).sort({date:"desc"})
 res.render("allideas",{
        allideas:allideas,
 })
  }catch(e)
  {
    res.send("Error 501 !")
  }
})


//showing all-ideas to logged in user with different navbar
router.get("/all-Ideas",auth,async(req,res)=>{
  try{
 const allideas=await Idea.find({}).sort({date:"desc"})
 res.render("allideas",{
        allideas:allideas,
        user:req.user,
 })
  }catch(e)
  {
    res.send("Error 501 !")
  }
})










module.exports=router
