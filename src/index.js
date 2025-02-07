import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./db.js";
import passport from "./passport.config.js";
import routes from "./routes/index.js";

import { UAParser } from "ua-parser-js";
import { connectRedis } from "./redis-client.js";

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
  let ua = UAParser(req.headers["user-agent"]);
  console.log("🚀 ~ app.get ~ ua:", ua.browser.name);

  res.send(
    "<div><a href='/api/auth/google'>Sign in with Google</a><br/><a href='/api/shorten/FZfD6Hzem1'>Redirect</a></div><br/><a href='/api/shorten/OwQYqFYCTC'>Redirect</a></div><br/><a href='/api/shorten/WGzdcBSDjb'>Redirect</a></div><br/><a href='/api/shorten/IrAyC3FeCP'>Redirect</a></div>"
  );
});

app.get("/profile", (req, res) => {
  res.send("Profile Page");
});

(async () => {
  try {
    await connectDB();
    await connectRedis();
    app.listen(PORT, async () => {
      console.log("server runnning on port", PORT);
      console.log("http://localhost:8000");
    });
  } catch (error) {
    console.error("Faile to start server", error);
    process.exit(1);
  }
})();
