
const path=require("path")
const express=require("express")
const hbs=require("hbs")
const methodoverride=require("method-override")
const ideaRouter=require("./router/IDEA-ROUTES")
const basicRouter=require("./router/BASIC-ROUTES")
const loginsignup=require("./router/login-signup")
const cookieParser = require('cookie-parser');

const app=express()


//public directry to be used in templates and partilas(in templates we can use them by /css/...)
const publicDirectoryPath=path.join(__dirname,"../public")
app.use(express.static(publicDirectoryPath))

// for templates and partials
app.set("view engine","hbs")
const viewPath=path.join(__dirname,"../templates/views")
app.set("views",viewPath)

const partialPath=path.join(__dirname,"../templates/partials")
hbs.registerPartials(partialPath)

//for mongodb
app.use(express.urlencoded({extended: true})) //for parsing the form data(i.e converting from plain text to object) basically body-parser
app.use(express.json()) //for postman json body data
require("./db/mongoose")
const User=require("./models/user")
const Idea=require("./models/idea")

//middleware for put request
app.use(methodoverride("_method"));

app.use(cookieParser());

//for index and about page
app.use(basicRouter)
//using user router for all ideas ROUTES
app.use(ideaRouter)

app.use(loginsignup)

const port=process.env.PORT 
app.listen(port,()=>{
  console.log(`server is up on port ${port}`)
})




// nodemon src/app.js -e js,hbs
