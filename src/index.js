//import required modules

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const operatorRoute = require("./routes/operator");
const adminRoute = require("./routes/admin");

//configure dotenv
dotenv.config();

//connect to port
const port = process.env.PORT || process.env.port;

//load app
const app = express();

//configure body parser
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//configure cross origin
app.use(cors({ origin: /http:\/\/localhost/ }));
app.options("*", cors());

//route configuration
app.get("/", (req, res) => {
  res.send("OK");
});

app.use("/api/users", userRoute); //user route configuration
app.use("/api/operator", operatorRoute); // operator route configuration
app.use("/api/admin", adminRoute); //admin route configuration

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
