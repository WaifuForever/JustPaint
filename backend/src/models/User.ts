import mongoose, { Schema, Document } from 'mongoose';

export enum Gender {
  male = 'male',
  female = 'female',
  undisclosed = 'undisclosed'
}

export interface IUser extends Document {
  email: string;
  description: string; 
  password: string;  
  following:  [{ //a array fill with the user ids
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'

  }];
  followers:  [{ //a array fill with the user ids
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'

  }];
  gender?: Gender;
  updatedAt: Date;

}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required:true, select: false },
  // Gets the Mongoose enum from the TypeScript enum
  gender: { type: String, enum: Object.values(Gender) },
  photo: {type: String},
  description: {type: String},
  followers: [{ //a array fill with the user ids
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'

  }],
  following: [{ //a array fill with the user ids
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'

  }],
  posts: [{ //a array fill with the user ids
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'

  }],

  country: {
    type: String
  },

  token_version: {
    type: Number,
    default: 0
  },

  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

// Export the model and return your IUser interface
export default mongoose.model<IUser>('User', UserSchema);

