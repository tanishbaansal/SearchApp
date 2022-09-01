//Importing node modules
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
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
    const response = await axios.post(
        `https://www.zaubacorp.com/custom-search`,
        { search: req.body.companyName, filter: "company" }
    );
    res.send(response.data);
});

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});
