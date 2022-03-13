require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "paragon",
  mongoUrl:
    process.env.MONGODB_URL ||
    "mongodb+srv://keno123:keno123@cluster0.4rety.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
};

export default config;
