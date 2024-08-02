require("dotenv").config();
import express, { Application, Request, Response } from "express";
const cors = require("cors");
const app: Application = express();
app.use(express.json()); // permet de manipuler les paramètre de type body
app.use(cors());

// Import des packages nécéssaire pour utiliser mailgun
const formData = require("form-data");
const Mailgun = require("mailgun.js");
// -- Utilisation de Mailgun
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Grégoire Paulay",
  key: process.env.MAILGUN_API_KEY,
});

app.get("/", (req: Request, res: Response) => {
  try {
    return res.status(200).json("Bienvenue sur le formulaire!");
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

app.post("/form", async (req: Request, res: Response) => {
  try {
    console.log("Log Body", req.body);
    const { name, email, sujet, message } = req.body;

    if (name && email && sujet && message) {
      const messageData = {
        from: `${name} <${email}>`,
        to: process.env.MAIL,
        subject: sujet,
        text: message,
      };
      const response = await client.messages.create(
        process.env.MAILGUN_DOMAIN,
        messageData
      );

      //   console.log(response);
      res.status(200).json(response);
    } else {
      return res.status(400).json({ message: "missing parameters" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Toute les routes sauf celles crées au dessus arriveront ici
app.all("*", (req: Request, res: Response) => {
  return res.status(404).json("Not found");
});
//Pour écouter le serveur : ici on écoute la requete du port 3000
app.listen(process.env.PORT, () => {
  console.log("server started");
});
