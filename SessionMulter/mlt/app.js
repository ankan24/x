const express = require('express');
const multer = require('multer');
const app = express();
app.listen(7070,()=>console.log('server started'));

const storage = multer.diskStorage({
    destination:'./upload',
    filename:function(req,file,cb){
       cb(null,`${Date.now()}${file.originalname}`)   
    } 
})

const upload = multer({storage:storage})

app.get('/',(req,res)=>{
  res.sendFile('index.html',{root:"./"})
})

app.post('/upload',upload.array('file',5),(req,res)=>{
    res.send('file uploaded');
}) 