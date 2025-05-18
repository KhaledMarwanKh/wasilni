const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('../services/Validators.js'); // Consolidated validators

// Constants for better maintainability (could move to config/constants.js)
const USER_ROLES = ['user', 'admin', 'driver'];
const NAME_MAX_LENGTH = 20;
const PASSWORD_MIN_LENGTH = 8;
const BCRYPT_SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [
        NAME_MAX_LENGTH,
        `Name cannot exceed ${NAME_MAX_LENGTH} characters`,
      ],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.emailRegex,
        message: 'Please provide a valid email address',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [
        PASSWORD_MIN_LENGTH,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
      ],
      validate: {
        validator: validator.passwordRegex,
        message:
          'Password must contain at least 1 uppercase letter and 1 number',
      },
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      validate: {
        validator: validator.phoneRegex,
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
      enum: {
        values: USER_ROLES,
        message: `Role must be one of: ${USER_ROLES.join(', ')}`,
      },
      default: 'user',
    },
    
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // For proper JSON output
    toObject: { virtuals: true },
  }
);

/* ====================== */
/*      MODEL METHODS     */
/* ====================== */

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
    next();
  } catch (err) {
    next(err);
  }
});

// Password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Find by email (including password)
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select('+password');
};

/* ====================== */
/*     QUERY HELPERS      */
/* ====================== */

// Example helper (add as needed)
userSchema.query.byRole = function (role) {
  return this.where({ role });
};

module.exports = mongoose.model('User', userSchema);
