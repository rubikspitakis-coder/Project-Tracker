import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

const AUTH_USERNAME = "admin";
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

if (!AUTH_PASSWORD) {
  throw new Error("AUTH_PASSWORD environment variable is required");
}

const PASSWORD_HASH = bcrypt.hashSync(AUTH_PASSWORD, 10);

export interface User {
  id: string;
  username: string;
}

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      if (username !== AUTH_USERNAME) {
        return done(null, false, { message: "Invalid username or password" });
      }

      const isValid = await bcrypt.compare(password, PASSWORD_HASH);
      if (!isValid) {
        return done(null, false, { message: "Invalid username or password" });
      }

      const user: User = { id: "1", username: AUTH_USERNAME };
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser((id: string, done) => {
  const user: User = { id, username: AUTH_USERNAME };
  done(null, user);
});

export default passport;
