const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const multer = require('multer');
app.listen(7070,()=>console.log('Server Started'));

 app.set('view engine','ejs');
 app.use(express.static(path.join(__dirname,'public')));
 app.use(express.json());
 app.use(express.urlencoded());



 app.get('/',(req,res)=>{
    res.sendFile('root.html',{root:'./views'})
 })


// session and authentication ----------------------------------------------------------------
 
 app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:'secret',
    cookie:{
        maxAge:1000*60*60*24*7
    }
 }))

let count = 0;
app.get('/count',(req,res)=>{
     if(req.session.count){
        req.session.count++;
     }else{
        req.session.count = 1;
     }
     res.send(`Count is - ${req.session.count} <br> Id is - ${req.sessionID}`)
})


 const userAuth = (req,res,next)=>{
    if(req.body.name === 'Ankan' && req.body.password == '24'){
        next();
    }else{
        // alert('Invalid username or password')
        res.send('Invalid username or password')
        // res.redirect('/login');
    }
}
app.get('/login',(req,res)=>{
    res.render('login');
})
app.post('/login',userAuth,(req,res)=>{
    // alert('Login successful')
    // res.send('Valid User')
    res.redirect('/upload');
})


// multer ----------------------------------------------------------------

const storage = multer.diskStorage({
    destination:'./upload',
    filename : function(req,file,cb){
        cb(null,`${Date.now()}${file.originalname}`)
    }
 })
 const upload = multer({storage:storage});


app.get('/upload',(req,res)=>{
    res.render('upload');
})

app.post('/upload',upload.single('file'),(req,res)=>{
    res.send('File Uploaded');
})


app.get('/ejs',(req,res)=>{
    res.render('ejs');
})
