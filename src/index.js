const cookieParser = require('cookie-parser');
const express=require('express');
require('dotenv').config()
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const userModel=require('./models/user');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');

const PORT=process.env.PORT;
app.listen(PORT) || 5000;

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_CONNECTION)
    .then(()=> console.log('MongoDb connected...'))
    .catch(err=>console.log(err));

app.get('/',(req,res)=>{
    res.render('index'); 
})


app.post('/create',async(req,res)=>{
    let {username,email,password,age}=req.body;
    saltRound=parseInt(process.env.SALT) || 10;
    const hash=await bcrypt.hash(password,saltRound);

    const createUser=await userModel.create({
        username,
        email,
        password:hash,
        age
    })

    let token=jwt.sign({email},"shehhh");
    res.cookie("token",token);
    res.send(createUser);
})

app.get("/login",async(req,res)=>{
    res.render('login');
})

app.get('/logout',async(req,res)=>{
    res.cookie("token","");
    res.redirect("/")
})

app.get('/hellow',async(req,res)=>{
    res.send("hell9o chai pelo");
})

app.post("/login",async(req,res)=>{
    let user=await userModel.findOne({email:req.body.email});
    console.log(user);
    if(!user)
        return res.send("something went wrong");

    const bResult=bcrypt.compare(req.body.password,user.password,function(err,result){
    
    console.log("bcyrpt result",result);

    if(result)    
    {
    let token=jwt.sign({email:user.email},"shehhh");
    res.cookie("token",token);
    res.send("yes you can login");
    }
       
    else
        res.send("no you cannot login");
   });
})


bcrypt.compare(1234,'$2b$10$19AIzxjr6brWK8z4qAleDOZLBAY0STJtd6jpWyMPP3gDOwbCrCUGm',function(err,result){
    console.log("seprate loggging",result);
})
//const ApiRoutes=require('./routes/api-routes');
//app.use('/api',ApiRoutes);
