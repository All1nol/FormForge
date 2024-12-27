import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    blockedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
