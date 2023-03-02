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

export async function getURL(req,res){
  const id = req.params.id;

  try{
    //check if url exists
    const queryResult = await db.query(
      `SELECT id, "shortUrl", url FROM urls WHERE id = $1`,
      [id]
    );

    const urlData = queryResult.rows[0];

    if(!urlData){
      return res.status(404).send("URL not found");
    }

    res.status(200).send(urlData);
    
  }catch(err){
    return res.status(500).send("Erro no getURL" + err.message);
  }

}

export async function getShortURL(req, res) {
  const { shortUrl } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT url FROM urls WHERE "shortUrl" = $1`,
      [shortUrl]
    );

    if (rows.length === 0) {
      return res.status(404).send("URL not found");
    }

    const { url } = rows[0];
    await db.query(
      `UPDATE urls SET "visitCount" = "visitCount" + 1 WHERE "shortUrl" = $1`,
      [shortUrl]
    );

    return res.redirect(url);
  } catch (error) {
    console.error(`Error in getShortURL: ${error.message}`);
    return res.status(500).send("Internal Server Error");
  }
}
