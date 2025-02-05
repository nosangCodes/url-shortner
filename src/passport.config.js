import { configDotenv } from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
configDotenv();


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

// serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// deserialize user
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
