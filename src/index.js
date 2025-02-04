import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./db.js";
import passport from "./passport.config.js";
import routes from "./routes/index.js";

const PORT = process.env.PORT || 8000;
const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(passport.initialize());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("<a href='/api/auth/google'>Sign in with Google</a>");
});

app.get("/profile", (req, res) => {
  res.send("Profile Page");
});

app.listen(PORT, async () => {
  await connectDB();
  console.log("server runnning on port", PORT);
  console.log("http://localhost:8000");
});
