const path = require("path");
const config = require("./utils/config");
const express = require("express");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");
const morgan = require("morgan");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const app = express();
morgan.token("body", req => JSON.stringify(req.body));

logger.info("Connecting to MongoDB");
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() =>{
    logger.info("Connected successfully to MongoDB!");
  })
  .catch(e => {
    logger.error("Error connecting to MongoDB: ", e.message);
  });

app.use(express.json());
app.use(middleware.tokenExtractor);
app.use(morgan(":method :url :status - :response-time ms :body"));
app.use(express.static("./build"));

app.use("/api/blogs", middleware.userExtractor, blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.route("*").get((req,res)=>{
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use((error, req, res, next)=>{
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "invalid token"
    });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "token expired"
    });
  }
  next();
});

module.exports = app;
