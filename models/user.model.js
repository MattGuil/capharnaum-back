const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const User = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: [isEmail],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },
    nom: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      trim: true,
    },
    prenom: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      trim: true,
    },
    bio: {
      type: String,
      required: false,
      minLength: 1,
      maxLength: 123,
      trim: true
    },
    interests: {
      type: Array,
      required: false
    },
    confirmationToken: {
      type: String,
      default: undefined,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// User.pre('save', async function(next){
//   const salt = await bcrypt.genSalt()
//   this.password = await bcrypt.hash(this.password,salt)
//   next()
// })

User.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Ne pas hacher si le mot de passe n'est pas modifié
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

User.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    console.log(user.password);
    const auth = await bcrypt.compare(password, user.password);
    console.log(auth);
    if (auth) {
      return user;
    }
    throw Error("Le mot de passe fourni est incorrect.");
  }
  throw Error("Aucun compte n'est associé à cet email. Nous vous invitons à en créer un.");
};

const UserModel = mongoose.model("user", User);

module.exports = UserModel;