import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  provider: {
    type: String,
    enum: ['internal', 'google', 'facebook', 'twitter'],
  },
  providerId: String,
})
const User = new mongoose.model('User', userSchema);

export default User;
