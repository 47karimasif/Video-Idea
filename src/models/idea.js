
const mongoose=require("mongoose")
const validator=require("validator")

const ideaSchema=new mongoose.Schema({
  title:{
  type:String,
  // required:true,
  trim:true,
  validate(value){
    if(validator.isEmpty(value)){
      throw new Error("please add a title")
    }
  }
},
details:{
  type:String,
  trim:true,
  validate(value){
    if(validator.isEmpty(value)){
      throw new Error("please add some details")
    }
  }
},
date:{
  type:Date,
  default:Date.now
},
owner:{
  type:mongoose.Schema.Types.ObjectId,
  required:true,
  ref:"User"
}

},{
  timestamps:true
})

const Idea=mongoose.model("Idea",ideaSchema)
//
// const idea1=new Idea({
//   title:"",
//   details:"it will reduce the time"
// })
// idea1.save().then(()=>{
//   console.log(idea1)
// }).catch((e)=>{
//   console.log(e)
// })

module.exports=Idea




// mongoose validate method
// age:{
//   type:Number,
//   validate(value) {
//     if(value<0){
//       throw new Error("age must be positive number")
//     }
//   }
// }
