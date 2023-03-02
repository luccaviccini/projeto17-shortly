import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";



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

export async function signIn(req, res) {
  const {email, password} = req.body;

  try {
    // check if user exists
    const {rows: users} = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    const [user] = users;
    if (!user) {
      return res.status(401).send("User not found.");
    }

    // compare passwords
    if (bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      await db.query(
        `INSERT INTO sessions (token, "userId") VALUES ($1, $2)`,
        [token, user.id]
      );
      return res.send(token);
    }

    res.sendStatus(401);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
