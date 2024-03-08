const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path"); // Module apportant des méthodes pour retourner des url
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

const app = express();

dotenv.config();
dbConnect(); // Connexion à la base de données.

//MIDDLEWARE GENERAUX---------------

app.use(express.json());

app.use((_, res, next) => {
  // Définition des autorisations CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images"))); // Génère l'URL de destination pour le stockage du fichier joint par l'utilisateur.

// ---------------------------------

module.exports = app;
