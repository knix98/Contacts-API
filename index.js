const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
const port = 8000;

// bodyParser.urlencoded returns middleware that only parses urlencoded bodies(and not json bodies)
//or in other words: looks at requests where the Content-Type header matches the type option
//A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body).
//This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).
app.use(bodyParser.urlencoded({ extended: false }));

//keeping the route-matching middleware at the very end
app.use("/", require("./routes/index"));

app.listen(port, () => console.log("Server started"));
