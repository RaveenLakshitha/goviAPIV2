const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
// Route Files
const shops = require("./routes/shop");
const architects = require("./routes/Architects/architect");
//const awardsAndPubd = require("./routes/Architects/awards&pubs");
//const projects = require("./routes/Architects/projects");
const users = require("./routes/user");
const information = require("./routes/Information/information");
const articles = require("./routes/Information/articles");
const awards = require("./routes/Architects/awards&pubs");
const projects = require("./routes/Architects/projects");
const cart = require("./routes/Cart/cart");
const cartItems = require("./routes/Cart/cartItem");
const auths = require("./routes/auth");
const forumCategories = require("./routes/Categories/forumCategories");
const infoCategories = require("./routes/Categories/infoCategories");
const itemCategories = require("./routes/Categories/itemCategories");
const rentItemsCategories = require("./routes/Categories/rentItemsCategories");
const items = require("./routes/Items&Rent/item");
const RentItems = require("./routes/Items&Rent/RentItems");
const Questions = require("./routes/Forum/Questions");
const Answers = require("./routes/Forum/Answers");
const experts = require("./routes/experts/experts");
const expertAppointmentSlots = require("./routes/experts/Appointments/slotsExpert");
const expertAppointments = require("./routes/experts/Appointments/appointmentsExpert");
const architectAppointmentSlots = require("./routes/Architects/Appointments/slotsArchitects");
const architectAppointments = require("./routes/Architects/Appointments/appointmentsArchitects");
const ratings = require("./routes/rating");
const shoporders = require("./routes/Orders/shopOrders");
const userorders = require("./routes/Orders/userOrders");
const reviews = require("./routes/review");
const advertisements = require("./routes/Advertisements/advertisement");
const notifications = require("./routes/Notifications/notifications");
const listItems = require("./routes/Wishlist/wishlistItems");
const wishlist = require("./routes/Wishlist/wishList");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const cors = require("cors");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

//Read & Load env vars to process.env
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 5000;

//Connect Database
connectDB();
//Init app var with express
const app = express();
app.use(cors());
//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//Sanitize Data
app.use(mongoSanitize());

//Helmet
app.use(helmet());

//Prevent XSS
app.use(xss());

//ENable Cors
app.use(cors());

//Prevent http params polution attack
app.use(hpp());
//http://webApplication/showproducts.asp?prodID=9 /*&prodID=*/UNION /*&prodID=*/SELECT 1 &prodID=2 &prodID=3 FROM /*&prodID=*/Users /*&prodID=*/ WHERE id=3

// Apply the rate limiting middleware to all requests
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20, // Limit each IP to 20 requests per `window` (here, per one minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

//Set static folder
app.use(express.static(path.join(__dirname, "uploads")));

//Set static folder
app.use(express.static(path.join(__dirname, "uploads")));

// Mount routes
app.use("/api/v1/shops", shops);
app.use("/api/v1/architects", architects);
//app.use("/api/v1/architects/awardsAndPubd", awardsAndPubd);
//app.use("/api/v1/architects/projects", projects);
app.use("/api/v1/users", users);
app.use("/api/v1/cart", cart);
app.use("/api/v1/cartItems", cartItems);
app.use("/api/v1/wishlist", wishlist);
app.use("/api/v1/listItems", listItems);
app.use("/api/v1/auths", auths);
app.use("/api/v1/experts", experts);
app.use("/api/v1/expertappointmentslots", expertAppointmentSlots);
app.use("/api/v1/expertAppointments", expertAppointments);
app.use("/api/v1/architectappointmentslots", architectAppointmentSlots);
app.use("/api/v1/architectAppointments", architectAppointments);
app.use("/api/v1/items", items);
app.use("/api/v1/rentItems", RentItems);
app.use("/api/v1/awards", awards);
app.use("/api/v1/projects", projects);
app.use("/api/v1/information", information);
app.use("/api/v1/articles", articles);
app.use("/api/v1/forumCategories", forumCategories);
app.use("/api/v1/infoCategories", infoCategories);
app.use("/api/v1/rentItemsCategories", rentItemsCategories);
app.use("/api/v1/itemCategories", itemCategories);
app.use("/api/v1/advertisements", advertisements);
app.use("/api/v1/forum/Questions", Questions);
app.use("/api/v1/forum/Answers", Answers);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/ratings", ratings);
app.use("/api/v1/shoporders", shoporders);
app.use("/api/v1/userorders", userorders);
app.use("/api/v1/notifications", notifications);

//ErrorHandler(Must after mounting routes)
app.use(errorHandler);
//To run a server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`);
  server.close(() => process.exit(1));
});
/* 
app.get('/',(req,res)=>{
  res.send('Hello');
  res.status(200).json({success:true,data:{name:}})
}) */

////web:node src/server.js

/* "scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "NODE_ENV=production nodemon server.js",
  "dev": "nodemon server"
}, */
