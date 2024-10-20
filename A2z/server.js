const express=require("express")
const fs=require("fs").promises;
const multer=require("multer");
const session=require("express-session")
const fss=require("fs")
const serveIndex = require('serve-index')
const path=require("path")
const app=express();



app.use(express.static('.'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:"secret",
    saveUninitialized:false,
    resave:false
}))
const staticDir = path.join(__dirname, 'uploads');
app.use('/getpages',isAuthenticated);
 app.use('/getpages', express.static(staticDir));
app.use('/getpages', serveIndex(staticDir, { icons: true }));

app.set("view engine",'ejs')
app.set("views",'./view')

app.get("/",(req,res)=>{
    res.sendFile("./login.html",{root:'./'})
})
app.get("/login",(req,res)=>{
    res.sendFile("./login.html",{root:'./'})
})

app.get("/signup",(req,res)=>{
    res.sendFile("./signup.html",{root:'./'})
})

app.get("/home",(req,res)=>{
    if(!req.session.user){
        return res.redirect('/login');
    }
    res.render('home', { name: req.session.user.name});
    // const userFolder = `./uploads/${req.session.user.name}`;
    // if (fss.existsSync(userFolder)) {
    //     // Read the files in the user's folder
    //     const files = fss.readdirSync(userFolder).map(file => `${file}`);
    //     res.render('home', { name: req.session.user.name});
    // }
})




app.post('/signup',async(req,res)=>{
    let data =JSON.parse( await fs.readFile("./user.json",'utf-8'));
    console.log("a");
    
    data.forEach((e)=>{
        if(e.email==req.body.email){
            res.json({message:"email already exist"});
        }
    })
    let userdata={
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    }
    data.push(userdata);
    await fs.writeFile('./user.json',JSON.stringify(data));
    res.send("done");
})

app.post('/login',async(req,res)=>{
    let data =JSON.parse( await fs.readFile("./user.json",'utf-8'));
    let isValidUser = false;
    data.forEach((e)=>{
        if(e.email==req.body.email && e.password==req.body.password){
            req.session.user={name:e.username,email:e.email}
             isValidUser = true;
         return   res.redirect('/home') 
        }
    })
    if(!isValidUser)
    res.send('email or password not valid');
})

const mstorage=multer.diskStorage({
    destination:'./Temp',
    filename:function(req,file,cb){
        cb(null,file.originalname);
    },
})

const upload=multer({
    storage:mstorage,
})

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('You are not authenticated. Please log in.');
    }
}

app.post('/upload',isAuthenticated,upload.single('filename'),(req,res)=>{
    if(!req.file){
        return res.status('400').send('no file upload')
    }

    if(!fss.existsSync(`./uploads/${req.session.user.name}`)){
    fss.mkdir(`./uploads/${req.session.user.name}`,(err)=>{
        if(err){
            console.log(err)
        }else{
            fss.rename(`./Temp/${req.file.filename}`,`./uploads/${req.session.user.name}/${req.file.filename}`,(err)=>{
                if(!err){
                    res.render('home', { name: req.session.user.name});
                }
            })
        }

    })
}else{
    fss.rename(`./Temp/${req.file.filename}`,`./uploads/${req.session.user.name}/${req.file.filename}`,(err)=>{
        if(err){
            console.log(err)
        }
        else{
            const userFolder = `./uploads/${req.session.user.name}`;
            const files = fss.readdirSync(userFolder).map(file => `${file}`);
            res.render('home', { name: req.session.user.name});
        }

    })
}
    
})



app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/')
})

app.listen(3000);