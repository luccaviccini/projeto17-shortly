import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";



export async function userSignUp(req, res) {
  const {name, email, password} = res.locals.userSignUp;

  try {  

    // create user
    await db.query(
      ` INSERT INTO users 
                    (name, email, password)
                    VALUES ($1, $2, $3)`,
      [name, email, password]
    );
    
    res.status(201).send("User created in database with success.");
    
  } catch (err) {
    return res.status(500).send("Erro no signUp" + err);
  }
}

export async function userSignIn(req, res) {
  const { email, password } = req.body;

  try {
    // check if user exists
    const { rows: users } = await db.query(
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
      await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2)`, [
        token,
        user.id,
      ]);
      return res.send(token);
    }

    res.sendStatus(401);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function getUserById(req, res) {
  const {user} = res.locals;

  try{
    const visitsQuery = await db.query(
      `SELECT SUM(s."views") FROM urls s WHERE s."userId" = $1`,
      [user.id]
    );
    const numberOfVisits = visitsQuery.rows[0];

    const urlsQuery = await db.query(
      `SELECT * FROM urls s WHERE s."userId" = $1`,
      [user.id]
    );

    const urls = urlsQuery.rows;

    res.send({
      id: user.id,
      name: user.name,
      visitCount: numberOfVisits.sum || 0,
      shortenedUrls: urls
      
    })

  }catch(err){
    return res.status(500).send(err.message);
  }
  
}
