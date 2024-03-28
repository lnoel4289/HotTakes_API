const Sauce = require("../models/Sauce");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.getAllSauces = (_, res) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneSauce = (req, res) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      if (!sauce) {
        res.status(404).json();
      }
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: req.file.path,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => {
      console.log(req);
      res.status(201).json({
        message: "Nouvelle sauce enregistrée !",
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// exports.modifySauce = (req, res) => {
//   const sauceObject = req.file
//     ? {
//         ...JSON.parse(req.body.sauce),
//         imageUrl: `http://${req.get("host")}/images/${req.file.filename}`,
//       }
//     : { ...req.body };
//   delete sauceObject._userId;

//   Sauce.findOne({ _id: req.params.id })
//     .then((sauce) => {
//       if (sauce.userId != req.auth.userId) {
//         res.status(403).json({ message: "Non-autorisé !" });
//       } else {
//         Sauce.updateOne(
//           { _id: req.params.id },
//           { ...sauceObject, _id: req.params.id }
//         )
//           .then(() => {
//             res.status(200).json({ message: "Sauce modifiée !" });
//           })
//           .catch((error) => res.status(500).json({ error }))
//           .then(() => {
//             if (req.file) {
//               const filename = sauce.imageUrl.split("/images")[1];
//               fs.unlink(`images/${filename}`, (error) => {
//                 if (error) {
//                   console.log(error);
//                 }
//               });
//             }
//           });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ error });
//     });
// };

exports.modifySauce = (req, res) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: req.file.path, // Chemin local de l'image temporaire sur le serveur
      }
    : { ...req.body };
  delete sauceObject._userId;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ message: "Sauce not found" });
      }

      if (sauce.userId != req.auth.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Supprimer l'ancienne image de Cloudinary
      if (req.file) {
        const publicId = sauce.imageUrl.split('/').pop().split('.')[0]; // Récupérer l'ID public de Cloudinary
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            return res.status(500).json({ error });
          }
        });
      }

      // Mettre à jour la sauce dans la base de données avec la nouvelle image
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => {
          res.status(200).json({ message: "Sauce modifiée" });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé !" });
      } else {
        const publicId = sauce.imageUrl.split("/").pop().split(".")[0];
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            return res.status(500).json({ error });
          }
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(500).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.likeSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      let like = sauce.likes;
      let dislike = sauce.dislikes;
      let userLiked = sauce.usersLiked;
      let userDisliked = sauce.usersDisliked;

      if (userDisliked.find((id) => id === req.body.userId)) {
        dislike -= 1;
        userDisliked = userDisliked.filter((id) => id != req.body.userId);
      } else if (userLiked.find((id) => id === req.body.userId)) {
        like -= 1;
        userLiked = userLiked.filter((id) => id != req.body.userId);
      }
      if (req.body.like === 1) {
        like += 1;
        userLiked.push(req.body.userId);
      } else if (req.body.like === -1) {
        dislike += 1;
        userDisliked.push(req.body.userId);
      }

      Sauce.updateOne(
        { _id: req.params.id },
        {
          likes: like,
          dislikes: dislike,
          usersLiked: userLiked,
          usersDisliked: userDisliked,
        }
      )
        .then(() => res.status(200).json({ message: "Vote accepté !" }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
