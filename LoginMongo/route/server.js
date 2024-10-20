const express=require("express");
const app=express();
const path=require("path")
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://ankan108:Ankan2004@cluster0.ypzdcal.mongodb.net/Ankan?retryWrites=true&w=majority&appName=Cluster0").then((ack)=>{
    console.log("db connected")
})
const userModel=require("../model/user")
app.get("/save",(req,res)=>{
    let obj={
        name:"Ankan",
        pass:"abx",
        history:"ajj",
        last:{
            time:123,
            valid:true
        },
        who:{
            me:"ami"
        }
    }
    let user=new userModel(obj);
    user.save().then((ack)=>{
        console.log(ack)
        res.end();
    })
})
app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"/login.html"));
})
app.post("/login",(req,res)=>{
    userModel.findOne({}).then((data)=>{
        data.history.push(new Date().toDateString()+"-"+new Date().toTimeString());
        data.last.push({
            time:Date.now(),
            valid:false
        })
        data.who.me.push("akash");
        data.save().then((ack)=>{
            console.log(ack);
            res.end()
        })
    })
})
app.listen(3000,()=>{
    console.log("server 3000")
})