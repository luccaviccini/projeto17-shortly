import { db } from "../database/database.connection.js";

export async function authValidation(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send("No token provided");
  }
  const token = authorization.replace("Bearer ", "");

  try {
    const sessionQuery = await db.query(
      `SELECT * FROM sessions WHERE token = $1`,
      [token]
    );
    const session = sessionQuery.rows[0];
    if (!session) {
      return res.status(401).send("Invalid token");
    }

    const userQuery = await db.query(`SELECT * FROM users WHERE id = $1`, [
      session.userId,
    ]);

    const user = userQuery.rows[0];
    if (!user) {
      return res.status(401).send("No user found");
    }

    res.locals.user = user;
    next();
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
