import CryptoJS from "crypto"
 
// let encryption = encrypt("anuj",key);
// let decryption=decrypt(encryption,key)
// console.log(encryption, decryption);

import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import express, { application } from 'express';
import cors from 'cors';
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { v1 as uuidv1 } from 'uuid'
dotenv.config();

let key="kjadsfkjads9afdskj1kj39"
function encrypt(str,key){
    let encryption = CryptoJS.AES.encrypt(str, key).toString();

    return encryption
}
function decrypt(str,key){

    var bytes  = CryptoJS.AES.decrypt(str, key);
    var decryptd = bytes.toString(CryptoJS.enc.Utf8);
    return decryptd
}  

// import Register from "./models/login/register.js"

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        await client.db("BooleanSquad").command({ ping: 1 });
        console.log("Connected successfully to the database");
    }
    catch (err) {
        console.log("Error connecting database: ", err.stack);
    }
}
run().catch(console.dir);

const db = client.db("BooleanSquad");
const userDb = db.collection("UserDB");
const locationDb = db.collection("LocationDB");
const iprApplication = db.collection("IPRApplication");
locationDb.createIndex({ location: "2dsphere" });

// const model = await tf.node.loadSavedModel(path, [tag], signatureKey);
// const output = model.predict(input);

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const hashIt = async (password) => {
    const salt = await bcrypt.genSalt(13);
    const hashed = await bcrypt.hash(password, salt);
    return { hashed, salt };
}
const cleanUpAndValidate = ({ firstName, lastName, username, email, password, confirmPassword }) => {
    return new Promise((resolve, reject) => {

        if (typeof (email) !== 'string')
            reject('Invalid Email');
        if (typeof (username) !== 'string')
            reject('Invalid Username');
        if (typeof (firstName) !== 'string')
            reject('Invalid name');
        if (typeof (lastName) !== 'string')
            reject('Invalid name');
        if (typeof (password) !== 'string')
            reject('Invalid Password');
        if (typeof (confirmPassword) !== 'string')
            reject('Invalid Password');

        // Empty strings evaluate to false
        if (!username || !password || !firstName || !email || !lastName || !confirmPassword)
            reject('Invalid Data');

        if (username.length < 3 || username.length > 100)
            reject('Username should be 3 to 100 charcters in length');

        if (password.length < 5 || password > 300)
            reject('Password should be 5 to 300 charcters in length');

        if (!validator.isEmail(email))
            reject('Invalid Email');

        resolve();
    })
}



app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (typeof (email) !== 'string' || typeof (password) !== 'string' || !email || !password) {
        return res.send({
            status: 400,
            message: "Invalid Data"
        })
    }

    // find() - May return you multiple objects, Returns empty array if nothing matches, returns an array of objects 
    // findOne() - One object, Returns null if nothing matches, returns an object 
    let user;
    try {
        if (validator.isEmail(email)) {
            user = await userDb.findOne({ email: email });
        }
        else {
            user = await userDb.findOne({ username: email });
        }
    }
    catch (err) {
        console.log(err);
        return res.send({
            status: 400,
            message: "Internal server error. Please try again",
            error: err
        })
    }

    console.log(res);

    if (!user) {
        return res.send({
            status: 400,
            message: "User not found",
            data: req.body
        });
    }

    // Comparing the password
    const hashed = await bcrypt.hash(password, user.salt);
    const isMatch = hashed === user.password;

    if (!isMatch) {
        return res.send({
            status: 400,
            message: "Invalid Password",
            data: {
                hashed,
                isMatch
            }
        });
    }

    // req.session.isAuth = true;
    // req.session.user = { username: user.username, email: user.email, userId: user._id };

    res.send({
        status: 200,
        message: "Logged in successfully",
        user: {
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }
    });
})

app.post("/register", async (req, res) => {
    const { firstName, lastName, username, email, password, confirmPassword } = req.body;

    // Validation of Data
    try {
        await cleanUpAndValidate({ firstName, lastName, username, email, password, confirmPassword });
    }
    catch (err) {
        return res.send({
            status: 400,
            message: err
        })
    }

    let userExists;
    // Check if user already exists
    try {
        userExists = await userDb.findOne({ email });
    }
    catch (err) {
        return res.send({
            status: 400,
            message: "Internal Server Error. Please try again.",
            error: err
        })
    }

    if (userExists)
        return res.send({
            status: 400,
            message: "User with email already exists"
        })

    try {
        userExists = await userDb.findOne({ username });
    }
    catch (err) {
        return res.send({
            status: 400,
            message: "Internal Server Error. Please try again.",
            error: err
        })
    }

    if (userExists)
        return res.send({
            status: 400,
            message: "Username already taken"
        })

    if (password !== confirmPassword)
        return res.send({
            status: 400,
            message: "Passwords do not match"
        })

    // Hash the password Plain text -> hash 
    const { hashed, salt } = await hashIt(password); // md5

    try {
        const user = await userDb.insertOne({
            firstName,
            lastName,
            username,
            email,
            password: hashed,
            salt
        });
        return res.send({
            status: 200,
            message: "Registration Successful",
            data: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    }
    catch (err) {
        return res.send({
            status: 400,
            message: "Internal Server Error. Please try again.",
            error: err
        })
    }
})



app.post('/fetchPendingApplications', async (req, res) => {
    const { email } = req.body;
    const user = await userDb.findOne({ email:encrypt(email) });
    if (!user) {
        return res.send({
            status: 400,
            message: "User not found"
        })
    }

    const applications = iprApplication.find({ email: encrypt(user.email) });

    const app = []
    const pending = []
    const approved = []
    const rejected = []


    applications.toArray((err, data) => {
        if (err) {
            res.send({
                status: 400,
                message: "Internal Server Error. Please try again.",
            })
        }
        else {
            data.forEach(element => {
                app.push(element)
            })
            return res.send({
                status: 200,
                message: "Applications fetched successfully",
                data: {
                    pending : app.filter(x => x.status === 'Pending'),
                    approved : app.filter(x => x.status === 'Approved'),
                    rejected : app.filter(x => x.status === 'Rejected')
                }
            })
        }

    })
})


    app.post("/iprApplication", async (req, res) => {
        let {
            name,
            email,
            phone,
            address,
            dob,
            gender,
            invention,
            inventors,
            description,
            novelFeatures,
            relationWithProcessOrProduct,
            advantages,
            experimentalData,
            possibleUses,
            possibleEndUsers,
            potentialMarketibility,
            reportedAnywhere,
            disclosedToAnybody,
            commercialInterestShown,
            commercialInterest,
            developmentStage,
            declarationAccepted } = req.body;

        try {
            await iprApplication.insertOne({
                name:encrypt(name),
                email : encrypt(email),
                phone : encrypt(phone),
                address : encrypt(address),
                dob : encrypt(dob),
                gender : encrypt(gender),
                invention : encrypt(invention),
                inventors : encrypt(inventors),
                description : encrypt(description),
                novelFeatures : encrypt(novelFeatures),
                relationWithProcessOrProduct : encrypt(relationWithProcessOrProduct),
                advantages : encrypt(advantages),
                experimentalData : encrypt(experimentalData),
                possibleUses : encrypt(possibleUses),
                possibleEndUsers : encrypt(possibleEndUsers),
                potentialMarketibility : encrypt(potentialMarketibility),
                reportedAnywhere : encrypt(reportedAnywhere),
                disclosedToAnybody : encrypt(disclosedToAnybody),
                commercialInterestShown : encrypt(commercialInterestShown),
                commercialInterest : encrypt(commercialInterest),
                developmentStage : encrypt(developmentStage),
                declarationAccepted : encrypt(declarationAccepted),
                status: "Pending",
                applicationId: uuidv1(applicationId),
                similarities: [ ]
            })
            return res.send({
                status: 200,
                message: "Registration Successful",
            });
        }
        catch (err) {
            console.log(err)
            return res.send({
                status: 400,
                message: "Internal Server Error. Please try again.",
                error: err
            })
        }
    })


    app.post('/positions', async (req, res) => {
        try {
            let { latitude, longitude, pin, place } = req.body;

            await locationDb.insertOne({
                pin: pin,
                place: place,
                location: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                }
            })
            res.send("Position successfully added");
        }
        catch (err) {
            res.status(400).send("There was an error adding the position");
        }
    })




    app.post('/nearest', async (req, res) => {

        try {
            const latitude = req.body.latitude;
            const longitude = req.body.longitude;
            const loc = locationDb.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                        key: "location",
                        // maxDistance: parseFloat(1000)*1609,
                        distanceField: "dist.calculated",
                        spherical: true
                    }
                }
            ]);

            let pos = [];

            await loc.forEach(ele => {
                pos.push(ele);
            })

            res.send({ pos });

        } catch (err) {

            res.send({ "error": err });
        }

    })



    const port = process.env.PORT || 5000

    app.listen(port, (err) => {
        if (err) console.log(err.message)
        else console.log("Listening on port: ", port)
    }
    )
    await client.close();