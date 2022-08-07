var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))


mongoose.connect('mongodb+srv://aman:12345@cluster0.pfdbtkg.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.post("/contact",(req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var dob = req.body.dob;
    var phone = req.body.phone;
    var state = req.body.state;
    var city = req.body.city;
    var pin = req.body.pin;
    var aadhar = req.body.aadhar;
    var message = req.body.message;

    var data = {
        "name": name,
        "email" : email,
        "phone": phone,
        "dob": dob,
        "state": state,
        "city": city,
        "pin": pin,
        "aadhar": aadhar,
        "message": message
        
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('index.html')

})


app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
}).listen(3001);


console.log("Listening on PORT 3001");