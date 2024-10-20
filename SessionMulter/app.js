const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const session = require('express-session');
app.listen(7070,(err)=>console.log('Server Started'));



app.set('view engine','ejs');
app.use(express.static(path.join(__dirname+'public')))
app.use(express.json());
app.use(express.urlencoded());



const storage = multer.diskStorage({
    destination:"./upload",
    filename:function(req,file,cb){
        cb(null,`${Date.now()}${file.originalname}`);
    }
})

const upload = multer({storage:storage});



let count = 0;
app.use(session({
    saveUninitialized:true,
    resave:false,
    secret:"ankan"
}))
 

app.get('/',(req,res)=>{
    res.render('file');
})

app.post('/upload',upload.single('file'),(req,res)=>{
     res.send('File  Uploaded!')
})
 
app.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/home.html'));
})

app.get('/count',(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{{
        req.session.count = 1;
    }}
    res.send(`Count - ${req.session.count}  and <br> Id - ${req.sessionID}`);
})