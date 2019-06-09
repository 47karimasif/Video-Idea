
const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const uniqueValidator=require("mongoose-unique-validator")
const jwt=require("jsonwebtoken")

const userSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
gmail:{
  type:String,
  unique:true,
  required:true,
  trim:true,
  lowercase:true,
  validate(value){
    if(!validator.isEmail(value))
  {
    throw new Error ("Enter a valid email ")
  }
  }
},
password:{
  type:String,
  trim:true,
  validate(value){
    if(value.length<6)
    {
      throw new Error ("password should be of more than 6 digit")
    }
  },
  required:true
},
tokens:[{

  token:{
    type:String,
    required:true
  }
}]

 // Dp:{
 //   type:Buffer,
 // }
},{
  timestamps:true
})

//Virtual propert for relationship b/w user and idea
userSchema.virtual("ideas",{
  ref:"Idea",
  localField:"_id",
  foreignField:"owner"
})

//generating tokens at the time of login and signup
userSchema.methods.generateAuthToken=async function(){
  const user=this
  const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET )
  user.tokens=user.tokens.concat({token:token})
  await user.save()
  return token
}



//for login
userSchema.statics.findByCredentials=async(gmail,password)=>{
 const user=await User.findOne({gmail:gmail})
 if(!user){
   throw new Error("Gmail did not match")
}
 const isMatch=await bcrypt.compare(password,user.password)
if(!isMatch)
{
  throw new Error ("Incorrect password")
}
return user;
}



//for hashing the password
userSchema.pre("save",async function(next){
  const user=this
  // const gmailrepeat=await User.findOne({gmail:user.gmail}) //for unque mail without npm
  // if(gmailrepeat){
  //   throw new Error("gmail already registered")
  // }
if(user.isModified("password")){
  user.password=await bcrypt.hash(user.password,8)
}
  next()
})

const User=mongoose.model("User",userSchema)

userSchema.plugin(uniqueValidator);
module.exports=User
