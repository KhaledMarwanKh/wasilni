const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  emailRegex,
  phoneRegex,
  passwordRegex,
} = require('../services/Validators');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [20, 'Name cannot exceed 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (email) => emailRegex.test(email),
        message: 'Please provide a valid email address',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      validate: {
        validator: (password) => passwordRegex.test(password),
        message:
          'Password must contain at least 1 uppercase letter and 1 number',
      },
      select: false, // Never return password in queries
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      validate: {
        validator: (phone) => phoneRegex.test(phone),
        message: 'Please provide a valid phone number',
      },
    },
    national_num: {
      type: String,
      required: [true, 'National ID is required'],
      unique: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'driver'],
      default: 'user',
    },
    valid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Auto-manage createdAt/updatedAt
  }
);


// Password hashing middleware (hash before save)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method for password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method for finding by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select('+password');
};

module.exports = mongoose.model('User', userSchema);
