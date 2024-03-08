const mongoose = require('mongoose');

const dbConnect = () => mongoose.connect(process.env.DB_AUTH,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log(`Connexion à MongoDB échouée ! ${err}`));

  module.exports = dbConnect