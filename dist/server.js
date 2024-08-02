"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const app = (0, express_1.default)();
app.use(express_1.default.json()); // permet de manipuler les paramètre de type body
app.use(cors());
const zod_1 = require("zod");
// Import des packages nécéssaire pour utiliser mailgun
const formData = require("form-data");
const Mailgun = require("mailgun.js");
// -- Utilisation de Mailgun
const mailgun = new Mailgun(formData);
const client = mailgun.client({
    username: "Grégoire Paulay",
    key: process.env.MAILGUN_API_KEY,
});
const dataSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    sujet: zod_1.z.string(),
    message: zod_1.z.string(),
});
app.get("/", (req, res) => {
    try {
        return res.status(200).json("Bienvenue sur le formulaire!");
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
app.post("/form", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Log Body", req.body);
        const { name, email, sujet, message } = req.body;
        const data = dataSchema.parse(req.body);
        // console.log(data);
        if (data) {
            const messageData = {
                from: `${name} <${email}>`,
                to: process.env.MAIL,
                subject: sujet,
                text: message,
            };
            const response = yield client.messages.create(process.env.MAILGUN_DOMAIN, messageData);
            //   console.log(response);
            res.status(200).json(response);
        }
        else {
            return res.status(400).json({ message: "missing parameters" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// Toute les routes sauf celles crées au dessus arriveront ici
app.all("*", (req, res) => {
    return res.status(404).json("Not found");
});
//Pour écouter le serveur : ici on écoute la requete du port 3000
app.listen(process.env.PORT, () => {
    console.log("server started");
});
