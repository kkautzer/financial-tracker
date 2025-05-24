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
    origin: [
        "https://financial-tracker-l4xs.onrender.com", // URL to deployment on `render`
        "http://localhost:5173", // should be removed for production pushes
        "https://master.d14d9ivj1e8k47.amplifyapp.com" // AWS
    ], // may update to include only the location of the frontend client(s)
    credentials: true
}));

const PORT = process.env.PORT; // port that this server will listen on - make API endpoint requests to this port
const dbName = process.env.NAME;
const dbHost = (process.env.PRODUCTION) ? process.env.HOST_CLOUD : process.env.HOST_LOCAL
const dbUser = (process.env.PRODUCTION) ? process.env.USER_CLOUD : process.env.USER_LOCAL
const dbPass = (process.env.PRODUCTION) ? process.env.PASSW_CLOUD : process.env.PASSW_LOCAL

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
        console.log("Connected to database at '"+dbHost+"' with ID="+db.threadId)
    }
});

/**
 * Decodes and verifies a JSON web token based on the secret key
 * @param {*} token unvalidated token string received within the HTTP request header
 * @returns If valid, returns the payload of the JWT. If invalid, returns null
 */
function validateJWT(token) {
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) { // invalid JWT credentials
        return null;
    }
    return payload;
}

// API Endpoints
app.get('/', (req, res) => {
    res.send("Hello world!");
})

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

// User Logout Functionality
app.post('/logout', async (req, res) => {
    
    // get & verify JWT
    token = req.get('cookie')?.split('=')[1];
    payload = validateJWT(token);
    if (payload == null) {
        console.log("Invalid JWT in request!");
        return res.status(401).json({message: "Invalid credentials!"});
    } else {
        console.log("User ID="+payload['userId']+" has signed out!");
        res.cookie('fintracker_auth', '', { // set jwt auth to empty, effectively destroy it
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });
        res.status(200).json({message: "Successfully Logged Out"})
    }
});

// get transactions - requires credentials
app.get('/transactions', async (req, res) => {
    // // // // console.log(req.get('cookie'));
    console.log("Transactions endpoint accessed!");
    
    // get & verify JWT
    token = req.get('cookie')?.split('=')?.[1];
    payload = validateJWT(token);
    if (payload == null) {
        console.log("Invalid JWT in request!");
        return res.status(401).json({message: "Invalid credentials!"});
    }

    // get transactions for the user
    db.query("select * from transactions where user_id = ? order by transaction_date desc", [payload.userId], (err, data) => {
        if (err) {
            console.log("Error retrieving transactions from database.")
            console.log(err);
            return res.status(500).json({message: "Error retrieving transactions from database"});
        } else {
            return res.status(200).json({message: "Successfully retrieved transactions", data: data});
        }
    });
});


app.post('/transactions', async (req, res) => {
    console.log("Adding transaction accessed!");
    const {catId, name, amt, date} = req.body;
    
    // verify JWT
    token = req.get('cookie')?.split('=')?.[1];
    payload = validateJWT(token);
    if (payload == null) {
        console.log("Invalid JWT in request!");
        return res.status(401).json({message: "Invalid credentials!"});
    }
    
    db.query('insert into transactions (user_id, category_id, transaction_name, transaction_amt, transaction_date) values (?, ?, ?, ?, ?)', [payload.userId, catId, name, amt, date], ((err, data) => {
        if (err) {
            console.error("Error creating a new transaction");
            console.log(err);
            return res.status(500).json({message: "Error creating transaction in database"})
        } else {
            return res.status(200).json({message: "Successfully created transaction"})
        }
    })
)
})

// get transaction categories - requires credentials
app.get('/categories', async (req,res) => {
    console.log("Categories endpoint accessed!");

    // get & verify JWT
    token = req.get('cookie')?.split('=')?.[1];
    payload = validateJWT(token);
    if (payload == null) {
        console.log("Invalid JWT in request!");
        return res.status(401).json({message: "Invalid credentials!"});
    }

    // get sections for the user
    db.query('select * from categories where user_id = ?', [payload.userId], (err, data) => {
        if (err) {
            console.log("Error retrieving categories!");
            console.log(err);
            return res.status(500).json({message: "Error retrieving categories from database"});
        } else {
            return res.status(200).json({message: "Successfully retrieved categories", data: data});
        }
    });
});

app.post('/categories', async (req, res) => {
    const {name, isExpense, budget} = req.body;

    console.log("Adding category accessed!");
    token = req.get('cookie')?.split('=')?.[1];
    payload = validateJWT(token);
    if (payload == null) {
        console.log("Invalid JWT in request!");
        return res.status(401).json({message: "Invalid credentials!"});
    }

    // insert into database
    db.query("insert into categories (user_id, category_is_expense, category_name, category_budget) values (?, ?, ?, ?)", [payload.userId, isExpense, name, budget], (err, result) => {
        if (err) {
            console.log("Error adding new category.");
            console.log(err);
            res.status(500).json({message: "Error creating category in database"})
        } else {
            res.status(200).json({message: "Successfully created new category"});
        }
    })

})

// Start Server
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});