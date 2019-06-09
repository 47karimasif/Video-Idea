const express=require("express")
const router=new express.Router()
const Idea=require("../models/idea")
const auth=require("../middleware/auth")
const User=require("../models/user")

//for exporting errormessage fnctn from public file
const ERRORmessages=require("../js/errormsg")

//ideas page that contains all ideas
router.get("/ideas",auth,async(req,res)=>{    //this async function will get called as we get the following server url thus try catch block will run
  try{
    const user=await User.findById({_id:req.user._id})
     await user.populate("ideas").execPopulate()
    res.render("idea/ideas",{
      ideas:user.ideas,
      user:req.user
                           })
     }
  catch(e)
     {
   console.log(e)
     }
})

//here we can add new ideas using post as method with form
router.get("/ideas/add",auth,async(req,res)=>{
  try{
  res.render("idea/add-ideas",{
    user:req.user
  })
}
catch(e)
{
  console.log(e)
}

})

//receiving data from form on add-idea page creating new idea and redirecting to idea page
router.post("/ideas",auth,async(req,res)=>{
const newIdea=new Idea({
  ...req.body,
  owner:req.user._id
})
try{
await newIdea.save() //if this save will be done properly than only next code will run.if it throw an error catch block will run.
res.redirect("/ideas")
  }
catch(e)
  {
const er1 = Object.keys(e.errors)
const allerrormsg=ERRORmessages(e,er1)
res.render("idea/add-ideas",{
  errors:allerrormsg,
  user:req.user
                            })

  }
})

//by clicking on edit button u will get this page
router.get("/ideas/edit/:id",auth,async(req,res)=>{
  const _id=req.params.id
try{
const idea=await Idea.findOne({_id,owner: req.user._id}) //returning the idea havin  both te particular owner id as well as the id appears on htttp request
// const idea=await Idea.findById(_id)
if(idea){
  res.render("idea/edit-idea",{
    idea:idea,
    user:req.user
                              })
   }else{
     res.send("error 404!")
   }
 }

catch(e)
   {
res.send("Error 500")
   }
})


//after submission of edit form updating the particular idea and redirecting to idea page
router.put("/ideas/:id",auth,async(req,res)=>{
try{
  await Idea.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
  res.redirect("/ideas")
  }
catch(e)
  {
  const er1 = Object.keys(e.errors)
  const allerrormsg=ERRORmessages(e,er1)

  res.render("idea/edit-idea",{
  idea:await Idea.findOne({_id:req.params.id}),
  errors:allerrormsg,
  user:req.user
                               })

  }
})



//to delete an idea
router.delete("/ideas/:id",auth,async(req,res)=>{
  try{
     await Idea.findByIdAndDelete(req.params.id)
     res.redirect("/ideas")
     }
  catch(e)
     {
    res.send("error 404")
     }
})


module.exports=router
