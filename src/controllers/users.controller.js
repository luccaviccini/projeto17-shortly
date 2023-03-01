import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";


export async function signUp(req, res) {
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

    // create user
    await db.query(` INSERT INTO users 
                    (name, email, password)
                    VALUES ($1, $2, $3)`,
                    [name, email, hashedPassword]);
    
    res.sendStatus(201);
    
  } catch (err) {
    return res.status(500).send(err.message);
    
  }
}