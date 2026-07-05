import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const BCRYPT_SALT_ROUNDS = 12;

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Profile name is required'],
      trim: true,
      maxlength: [30, 'Profile name cannot exceed 30 characters'],
    },
    avatar: {
      type: String,
      default: 'default',
    },
    isKids: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: 'en',
    },
    maturityRating: {
      type: String,
      enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'ALL'],
      default: 'ALL',
    },
    myList: [
      {
        mediaId: { type: Number, required: true },
        mediaType: { type: String, enum: ['movie', 'tv'], required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    favorites: [
      {
        mediaId: { type: Number, required: true },
        mediaType: { type: String, enum: ['movie', 'tv'], required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    watchHistory: [
      {
        mediaId: { type: Number, required: true },
        mediaType: { type: String, enum: ['movie', 'tv'], required: true },
        title: { type: String },
        posterPath: { type: String },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        duration: { type: Number, default: 0 },
        watchedAt: { type: Date, default: Date.now },
        seasonNumber: { type: Number },
        episodeNumber: { type: Number },
      },
    ],
    continueWatching: [
      {
        mediaId: { type: Number, required: true },
        mediaType: { type: String, enum: ['movie', 'tv'], required: true },
        title: { type: String },
        posterPath: { type: String },
        backdropPath: { type: String },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        duration: { type: Number, default: 0 },
        lastWatched: { type: Date, default: Date.now },
        seasonNumber: { type: Number },
        episodeNumber: { type: Number },
      },
    ],
  },
  { _id: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    profiles: {
      type: [ProfileSchema],
      validate: {
        validator: function (profiles) {
          return profiles.length <= 5;
        },
        message: 'A maximum of 5 profiles are allowed per account',
      },
    },
    activeProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    lastLoginAt: {
      type: Date,
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'standard', 'premium'],
        default: 'free',
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled'],
        default: 'active',
      },
      expiresAt: { type: Date },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
UserSchema.index({ email: 1 });
UserSchema.index({ 'profiles._id': 1 });

// ─── Pre-save hooks ──────────────────────────────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);

  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }

  return next();
});

UserSchema.pre('save', function (next) {
  // Create a default profile for new users
  if (this.isNew && this.profiles.length === 0) {
    this.profiles.push({
      name: this.name,
      avatar: 'default',
      isKids: false,
    });
  }
  return next();
});

// ─── Instance Methods ────────────────────────────────────────────────────────
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.getActiveProfile = function () {
  if (!this.activeProfileId) {
    return this.profiles[0] || null;
  }
  return this.profiles.id(this.activeProfileId) || this.profiles[0] || null;
};

UserSchema.methods.hasProfile = function (profileId) {
  return this.profiles.some((p) => p._id.toString() === profileId.toString());
};

const User = mongoose.model('User', UserSchema);

export default User;
