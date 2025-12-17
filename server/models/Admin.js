import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false }, // Don't include password in queries by default
  },
  { 
    timestamps: true,
    collation: { locale: "en", strength: 2 },
  }
);

// Index for faster username lookups
adminSchema.index({ username: 1 });

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.matchPassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Optimize JSON output - never expose password
adminSchema.set("toJSON", { 
  virtuals: false, 
  versionKey: false,
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;


