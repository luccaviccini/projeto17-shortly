import bcrypt from "bcrypt";
import {db} from "../database/database.connection.js";

export async function userExists(req, res, next) {
  const {name, email, password} = req.body;
  
  try {
    // check if user already exists with that email
    const {rows: users} = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    const [user] = users;
    if (user) {
      return res.status(409).send("User with that email already exists.");
    }

    // hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    res.locals.userSignUp = {
      name,
      email,
      password: hashedPassword
    };
    next();
    
  } catch (err) {
    return res.status(500).send(err.message);
  }
}