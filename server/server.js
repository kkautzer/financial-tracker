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
app.get('/', async (req, res) => {
    res.send("Hello world!");
})

// User Account Creation
app.post("/api/register", async (req, res) => {
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
app.post("/api/login", async (req, res) => {
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
                    sameSite: 'None'
                });
                return res.status(200).json({message: "Successfully Logged In!"});
            }
        }
    });
});

// User Logout Functionality
app.post('/api/logout', async (req, res) => {
    
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
            sameSite: 'None'
        });
        res.status(200).json({message: "Successfully Logged Out"})
    }
});

// update user account data
app.put('/api/profile', async (req, res) => {
    const { pfp, email, pass } = req.body;

    // verify JWT is valid
    token = req.get('cookie').split('=')[1];
    payload = validateJWT(token);
    if (payload == null) {
        console.log('Invalid JWT in request!');
        return res.status(401).json({message: "Invalid credentials"});
    } 

    db.query('select * from users where user_email = ?', [email], async (err, result) => {
        if (err) {
            console.log('Error getting users');
            console.log(err);
            return res.status(500).json({ message: "Error getting users in database" });
        } else if (result.length > 0) {
            return res.status(409).json({ message: "A user with this email already exists!" });
        } else {

            let setters = [];
            let settersVals = [];

            if (pfp !== null) {
                setters.push('user_pfp = ?');
                settersVals.push(pfp);
            }
            if (email !== null) {
                setters.push('user_email = ?');
                settersVals.push(email);
            }
            if (pass !== null) {
                const hashed = await bcrypt.hash(pass, 10);
                setters.push("user_psw = ?");
                settersVals.push(hashed);
            }
            
            db.query(`update users set ${setters.join(' and ')} where user_id = ?`, [...settersVals, payload['userId']], (err, result) => {
                if (err) {
                    console.log('Error updating user')
                    console.log(err);
                    return res.status(500).json({message: "Error deleting category in database"})
                } else {
                    // update the JWT on the client w/ new info
                    const token = jwt.sign(
                        {
                            userId: payload['userId'],
                            userEmail: email,
                        }, 
                        process.env.JWT_SECRET,
                        {expiresIn: '6h'}
                    );
                    res.cookie('fintracker_auth', token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'None'
                    });

                    return res.status(200).json({message: "Successfully updated profile"})
                }
            })
        }
    });
});

app.delete('/api/profile', async (req, res) => {
    // get & verify JWT
    token = req.get('cookie')?.split('=')?.[1];
    payload = validateJWT(token);
    if (payload == null) {
        console.log("Invalid JWT in request!");
        return res.status(401).json({message: "Invalid credentials!"});
    }

    db.query('delete from users where user_id = ?', [payload['userId']], (err, result) => {
        if (err) {
            return res.status(500).send({message: "Internal error deleting profile."});
        } else {
            res.cookie('fintracker_auth', '', { // set JWT to empty, effectively destroying it
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            });
            return res.status(200).send({message: "Successfully deleted profile."})
        }
    })
})

// get transactions - requires credentials
app.get('/api/transactions', async (req, res) => {

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


app.post('/api/transactions', async (req, res) => {
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
    }))
})

app.put('/api/transactions', async (req, res) => {
    const { id, catId, name, amt, date } = req.body;

    token = req.get('cookie')?.split('=')[1];
    payload = validateJWT(token);
    if (payload == null) {
        console.log("Invalid JWT in request!");
        return res.status(401).json({message: "Invalid credentials!"});
    }

    db.query('update transactions set category_id = ?, transaction_name = ?, transaction_amt = ?, transaction_date = ? where transaction_id = ? and user_id = ?', [catId, name, amt, date, id, payload.userId], (err, result) => {
        if (err) {
            console.log("Error updating transaction!");
            console.log(err);
            return res.status(500).json({message: "Error updating transactions in database"})
        } else {
            if (result.affectedRows > 0) {
                return res.status(200).json({message: "Successfully updated transaction"});
            } else {
                return res.status(404).json({message: "No transactions in database have a matching ID"})
            }
        }
    })
})

app.delete('/api/transactions', async (req, res) => {
    const { id } = req.body;

    token = req.get('cookie').split('=')[1];
    payload = validateJWT(token);
    if (payload == null) {
        console.log('Invalid JWT in request!');
        return res.status(401).json({message: "Invalid credentials"});
    }

    db.query('delete from transactions where user_id = ? and transaction_id = ?', [payload.userId, id], (err, result) => {
        if (err) {
            console.log('Error deleting transaction')
            console.log(err);
            res.status(500).json({message: "Error deleting transaction in database"})
        } else {
            res.status(200).json({message: "Successfully deleted transaction!"});
        }
    })
})

// get transaction categories - requires credentials
app.get('/api/categories', async (req,res) => {

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

app.post('/api/categories', async (req, res) => {
    const {name, isExpense, budget} = req.body;

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
});

app.put('/api/categories/', async (req, res) => {
    const { id, name, isExpense, budget } = req.body;

    // verify JWT
    token = req.get('cookie').split('=')[1];
    payload = validateJWT(token);
    if (payload == null) {
        console.log('Invalid JWT in request!');
        return res.status(401).json({message: "Invalid credentials!"});
    }

    // update entry w/ matching id
    db.query('update categories set category_name = ?, category_is_expense = ?, category_budget = ? where category_id = ? and user_id = ?', [name, isExpense, budget, id, payload.userId], (err, result) => {
        if (err) {
            console.log("Error updating category");
            console.log(err);
            res.status(500).json({message: "Error updating category in database"});
        } else {
            if (result.affectedRows > 0) {
                res.status(200).json({message: "Successfully updated category"})
            } else {
                res.status(404).json({message: "No categories in database have a matching ID"})
            }
        }
    })
});

app.delete('/api/categories/', async (req, res) => {
    const { id } = req.body;

    token = req.get('cookie').split('=')[1];
    payload = validateJWT(token);
    if (payload == null) {
        console.log('Invalid JWT in request!');
        return res.status(401).json({message: "Invalid credentials"});
    }

    db.query('delete from categories where user_id = ? and category_id = ?', [payload.userId, id], (err, result) => {
        if (err) {
            console.log('Error deleting category')
            console.log(err);
            res.status(500).json({message: "Error deleting category in database"})
        } else {
            res.status(200).json({message: "Successfully deleted category!"});
        }
    })
})

// Start Server
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});