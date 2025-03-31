const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173", // may update to include only the location of the frontend client(s)
    credentials: true
}));

const PORT = process.env.PORT; // port that this server will listen on - make API endpoint requests to this port
const dbHost = process.env.HOST;
const dbUser = process.env.USER;
const dbPass = process.env.PASSW;
const dbName = process.env.NAME;

// Connect to the database
const db = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbName
});
db.connect((err) => {
    if (err) {
        console.log("Error connecting to mySQL: " + err.stack);
        return;
    } else  {
        console.log("Connected to mySQL as ID = " + db.threadId);
    }
});

// API Endpoints

// User Login Verification
app.post("/login", async (req, res) => {
    console.log("Login Endpoint Accessed");
    const { email, password } = req.body;

    db.query("select * from users where user_email = ?", [email], async (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({message:"Failed to log in - an unknown server error occurred"})
        } else {
            if ( result.length  < 1) { // no accounts w/ given email
                return res.status(401).json({message: "No account associated with the given email"});
            } else if (!(await bcrypt.compare(password, result[0]['user_psw'])) ) { // password doesn't match
                return res.status(401).json({message: "Incorrect password"});
            } else { // valid email & password
                // username & password are correct
                console.log("User ID="+result[0]['user_id']+" has signed in!")
                
                const token = jwt.sign(
                    {
                        userId: result[0]['user_id'],
                        userEmail: email,
                        userPsw: password
                    }, 
                    process.env.JWT_SECRET,
                    {expiresIn: '6h'}
                );
                res.cookie('fintracker_auth', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict'
                });
                return res.status(200).json({message: "Successfully Logged In!"});
            }
        }
    });
});

// User Account Creation
app.post("/register", async (req, res) => {
    console.log("Registration Endpoint Accessed");
    const {email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    db.query("select * from users where user_email = ?", [email], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({message: "Failed to create account - an unknown server error occurred"});
        } else if (result.length > 0) { // account with this email already exists
            return res.status(409).json({message: "Account with this email already exists"});
        }
        db.query("insert into users (user_email, user_psw) values (?, ?)", [email, hashed], (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({message: "Failed to create account - an unknown server error occurred"});
            } else { // successfully created the account
                return res.status(201).json({message: "Successfully created account", email: email});
            }
        });
    });

});


// Start Server
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});