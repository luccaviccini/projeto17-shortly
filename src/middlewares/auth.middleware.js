import { db } from "../database/database.connection.js";

export async function authValidation(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).send("No token provided");
  }
  const token = auth.replace("Bearer ", "");

  try {
    const sessionQuery = await db.query(
      `SELECT * FROM sessions WHERE token = $1`,
      [token]
    );
    const session = sessionQuery.rows[0];
    if (!session) {
      return res.status(401).send("Invalid token");
    }

    res.locals.session = session;     
    next();
    
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
