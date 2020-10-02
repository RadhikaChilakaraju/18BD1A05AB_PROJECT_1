var express=require('express');
var app=express(); 

const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient=require('mongodb').MongoClient;
let server=require('./server');
let middleware=require('./middleware');
//const response=require('express');

const url='mongodb://127.0.0.1:27017';
const dbName='HospitalProject';

let db
MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected database: ${url}`);
    console.log(`Database : ${dbName}`);
});

app.get('/hospital',middleware.checkToken, function(req,res){
    console.log("Fetching data from hospital collections");
    var data=db.collection('hospitalInfo').find().toArray().then(result => res.json(result));

});

app.get('/ventilator',middleware.checkToken, function(req,res){
    console.log("Fetching data from ventilator collections");
    var data=db.collection('VentilatorInfo').find().toArray().then(result => res.json(result));

});

app.post('/ventilatorbystatus',middleware.checkToken,function(req,res){    
    var Status=req.body.Status;
    console.log("fetching data of "+Status+" ventilators");
    var data=db.collection('VentilatorInfo').find({"Status":Status}).toArray().then(result => res.json(result));

});

app.post('/ventilatorbyname',middleware.checkToken,function(req,res){
    var Name=req.query.Name;
    console.log("fetching data of "+Name+" ventilators");
    var data=db.collection('VentilatorInfo').find({"Name":Name}).toArray().then(result => res.json(result));

});

app.post('/hospitalbyname',middleware.checkToken,(req,res)=>{
    var Name=req.query.Name;
    console.log("fetching data of "+Name+" hospital");
    var data=db.collection('hospitalInfo').find({"Name":Name}).toArray().then(result => res.json(result));

});

app.put('/updateventilator', middleware.checkToken,function(req,res){
    var VentilatorId={VentilatorId:req.body.VentilatorId};
    console.log("updating "+VentilatorId);
    var val={$set:{Status:req.body.Status}};
    db.collection("VentilatorInfo").updateOne(VentilatorId,val,function(err,result){
        if (err) throw err;
        res.json('1 ventilator updated');
        console.log("1 ventilator updated");
    });
});

app.put('/addventilator',middleware.checkToken,function(req,res){
    var hid=req.body.hid;
    var Vid=req.body.VentilatorId;
    var Status=req.body.Status;
    var Name=req.body.Name;
    var item={hid:hid,Name:Name,VentilatorId:Vid,Status:Status};
    db.collection('VentilatorInfo').insertOne(item,function(err,result){
        if(err) throw err;
        res.json(" Ventilator added");
        console.log("ventilator "+hid+" added");
    });
});

app.delete('/deleteventilator',middleware.checkToken,function(req,res){
    var todel={VentilatorId:req.body.VentilatorId};
    db.collection('VentilatorInfo').deleteOne(todel,function(err,obj){
        if(err) throw err;
        res.json("VentilatorInfo "+req.body.VentilatorId+ " deleted");
        console.log("VentilatorInfo"+req.body.VentilatorId+ " deleted");

    });
});



app.listen(8080);
