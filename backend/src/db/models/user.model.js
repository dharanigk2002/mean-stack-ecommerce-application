import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: [true, "Please enter a different email"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be atleast 8 characters long"],
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordMatching = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.generateJwtToken = function (payload) {
  const token = jwt.sign(payload, process.env.JWT_SERCRET, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.statics.verifyToken = function (token) {
  const payload = jwt.verify(token, process.env.JWT_SERCRET);
  return payload;
};

const User = mongoose.model("User", userSchema);
export default User;
