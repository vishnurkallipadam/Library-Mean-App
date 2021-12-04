const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;
const bookData=require('./src/model/bookData')
const authorData=require('./src/model/authorData')
const adminData=require('./src/model/adminData')
const usersData=require('./src/model/userData')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path');
app.use(express.static('./dist/LibraryApp'));

app.use(cors());
app.use(express.json())

let verify=false;

function verifyUserToken(req, res) {
    if(!req.headers.userauthorization) {
        return res.status(401).send('Unauthorized request4')
      }
      let token = req.headers.userauthorization.split(' ')[1]
      if(token === 'null') {
        return res.status(401).send('Unauthorized request5')    
      }
      let payload = jwt.verify(token, 'userKey')
      if(!payload) {
        return res.status(401).send('Unauthorized request6')    
      }
      req.userId = payload.subject
      verify==true
  }

  function verifyAdminToken(req, res,next) {
    if(!req.headers.adminauthorization) {
      return res.status(401).send('Unauthorized request4')
    }
    let token = req.headers.adminauthorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request5')    
    }
    let payload = jwt.verify(token, 'adminKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request6')    
    }
    req.userId = payload.subject
    verify==true

    next()
  }


app.get('/api/books',verifySignin,(req,res)=>{
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD");
    console.log("started");
    bookData.find(function(err,books){
        res.send(books)
    })
});

app.get('/api/book/:id',verifySignin,function(req,res){  
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD"); 
    let id=req.params.id;
    bookData.findOne({_id:id},function(err,book){ 
        res.send(book)
    })
});

app.post('/api/add-book',verifyAdminToken,(req,res)=>{
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD"); 
    console.log(req.body);
    var item={
        title : req.body.book.title,
        author : req.body.book.author,
        genere : req.body.book.genere,
        image : req.body.book.image
    }
    let book = new bookData(item);
    book.save();
});
app.delete('/api/remove-book/:id',verifyAdminToken,(req,res)=>{
    
    id = req.params.id;
    bookData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
});

app.put('/api/update-book',verifyAdminToken,(req,res)=>{
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD"); 
    console.log(req.body)
    let id=req.body._id
    bookData.findByIdAndUpdate({"_id":id},
    {$set:
        {
                                        "title" : req.body.title,
                                        "author" : req.body.author,
                                        "genere" : req.body.genere,
                                        "image" : req.body.image

                                        
                                    }})
                                    .then(()=>{
                                        res.send()
                                    })
                                })
                                
app.get('/api/authors',verifySignin,(req,res)=>{
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD");
    console.log("started");
    authorData.find(function(err,authors){
        res.send(authors)
    })
});

app.get('/api/author/:id',verifySignin,function(req,res){  
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD"); 
    let id=req.params.id;
    authorData.findOne({_id:id},function(err,author){ 
        res.send(author)
    })
});

app.post('/api/add-author',verifyAdminToken,(req,res)=>{
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD"); 
    console.log(req.body);
    var item={
        name : req.body.author.name,
        works : req.body.author.works,
        penname : req.body.author.penname,
        image : req.body.author.image
    }
    let author = new authorData(item);
    author.save();
});

app.delete('/api/remove-author/:id',verifyAdminToken,(req,res)=>{
    
    id = req.params.id;
    authorData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success removed')
        res.send();
    })
});

app.put('/api/update-author',verifyAdminToken,(req,res)=>{
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD"); 
    console.log(req.body)
    let id=req.body._id
    authorData.findByIdAndUpdate({"_id":id},
    {$set:
        {
            "name" : req.body.name,
            "works" : req.body.works,
            "penname" : req.body.penname,
            "image" : req.body.image
            
            
        }})
        .then(()=>{
            res.send()
        })
    });
    
    app.post('/api/login',(req,res)=>{
        console.log(req.body);
        let userData=req.body
        if(userData.uname=='admin'){
            adminData.findOne({username:userData.uname},(err,admin)=>{
                if(admin){
                    bcrypt.compare(userData.password,admin.password)
                    .then((response)=>{
                        if(response){
                            console.log("admin");
                            let payload = {subject: userData.uname+userData.password}
                            let token = jwt.sign(payload, 'adminKey')
                            res.status(200).send({token,role:'admin'})
                           
                        }else{
                            res.status(401).send('Invalid Admin Password')
                        }
                    })   
                }else{
                    res.status(401).send('Invalid credential')
                }
            })

        }else{
            usersData.findOne({username:userData.uname},function (err,user){
                if(user){
                    bcrypt.compare(userData.password,user.password)
                    .then((status)=>{
                        if (status){
                            
                            console.log(' user logged in');
                            let payload = {subject: userData.uname+userData.password}
                            let token = jwt.sign(payload, 'userKey')
                            res.status(200).send({token,role:'user'})
                        }else{
                            
                            res.status(401).send('Invalid user Password')
    
                        }
                    })
                }else{
                    
                    console.log("failed");
                    res.status(401).send('Invalid credential')
                }
            })
        }
        
    })

    app.post('/api/signup',async (req,res)=>{
        console.log(req.body);
        var user={
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            phoneno : req.body.phoneno
        }
        console.log(user);
        user.password = await bcrypt.hash(user.password,10);
        console.log(user.password);
        var user=usersData(user);
        user.save();
        res.send()
    })
    
    function verifySignin(req,res,next){
        if(verify){
            console.log(verify);
            return res.status(401).send('Unauthorized request10')
        }else{
            next()
        }
    }
    
    app.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname + '/dist//LibraryApp/index.html'));
       });

    app.listen(port,()=>{console.log("server Ready at"+port)});