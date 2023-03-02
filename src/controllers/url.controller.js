import { db } from "../database/database.connection.js";
import {nanoid} from "nanoid";

export async function postURL(req,res){
  const {url} = req.body;
  const {userId} = res.locals.session;

  const shortURL = nanoid(10);

  try{
    await db.query(
      `INSERT INTO urls ("userId", url, "shortUrl") VALUES ($1, $2, $3)`,
      [userId, url, shortURL]
    );

    const queryResult = await db.query(
      `SELECT id,"shortUrl" FROM urls WHERE url = $1;`,
      [url]
    );

    const shortUrlData = queryResult.rows[0];
    return res.status(201).send(shortUrlData);
  }
  catch(err){
    return res.status(500).send(err.message);
  }


}