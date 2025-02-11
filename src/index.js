import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./db.js";
import passport from "./passport.config.js";
import routes from "./routes/index.js";

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
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shorty</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f4f4f4;
          font-family: Arial, sans-serif;
        }
        .btn {
          display: inline-block;
          padding: 12px 24px;
          font-size: 16px;
          color: white;
          background-color: #4285F4;
          border: none;
          border-radius: 5px;
          text-decoration: none;
          transition: background 0.3s ease;
        }
        .btn:hover {
          background-color: #357ae8;
        }
      </style>
    </head>
    <body>
      <a href='/api/auth/google' class='btn'>Sign in with Google</a>
    </body>
    </html>
  `);
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
    });
  } catch (error) {
    console.error("Faile to start server", error);
    process.exit(1);
  }
})();
