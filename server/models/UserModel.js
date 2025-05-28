<<<<<<< HEAD
import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "staff"],
    required: true,
    default: "staff",
  },
  avatar: {
    type: String,
  },
});

userSchema.pre('save', async function(next){
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
}, );

const User = mongoose.model("Users", userSchema);

export default User;
=======
import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "staff"],
    required: true,
    default: "staff",
  },
  avatar: {
    type: String,
  },
});

userSchema.pre('save', async function(next){
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
}, );

const User = mongoose.model("Users", userSchema);

export default User;
>>>>>>> quanna
