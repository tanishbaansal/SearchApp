//Importing node modules
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const Pool = require("pg").Pool;
const { createProxyMiddleware } = require("http-proxy-middleware");

//Connecting to Database
require("dotenv").config();
const pool = new Pool({
    user: process.env.DB_USER_NAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

//Enabling cors for the backend
const cors = require("cors");
app.use(cors());

//Port to run the backend on
const port = 3001;

//enabling bodyParser and getting
//request data in json format
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

//Get Data From zaubacorp
app.post("/", async (req, res) => {
    console.log("Calling Zaubacorp");
    const response = await axios.post(
        `https://www.zaubacorp.com/custom-search/`,
        {
            search: req.body.companyName,
            filter: "company",
        }
    );
    res.send(response.data);
});

app.get("/get-companies", async (req, res) => {
    try {
        let result = await pool.query(
            "SELECT * FROM companies ORDER BY created_at DESC"
        );
        res.send(result.rows);
    } catch (error) {
        console.log(error.stack);
        res.send();
    }
});
app.post("/add-company", async (req, res) => {
    try {
        let result = await pool.query(
            `INSERT INTO companies (name, cin) VALUES ('${req.body.companyName}', '${req.body.companyCIN}')`
        );
        if (result.rowCount == 1) {
            res.send("SUCCESS");
        } else {
            throw error;
        }
    } catch (error) {
        console.log(`Failure while insertion ${error}`);
        res.send("FAILURE");
    }
});

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});
