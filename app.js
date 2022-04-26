const express = require("express");
const mongoose = require('mongoose');
const cors = require ('cors');
const bodyParser= require('body-parser');
const cookieParser= require('cookie-parser');
const morgan = require ('morgan');
const expressValidator = require ('express-validator')
require("dotenv").config();
//import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const braintreeRoutes =require("./routes/braintree")
const orderRoutes = require ("./routes/order")



//app
const app = express();
app.use(cors());
//Activer CORS


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
   });
//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser:true,
    useCreateIndex:true
})
.then(()=>console.log("DB Connected"));
//middelwares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())


//routes middelware
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",braintreeRoutes);
app.use("/api",orderRoutes);





const port = process.env.PORT || 5000;

app.listen(port,() =>{
    console.log('server is running on port 5000 ');
});
