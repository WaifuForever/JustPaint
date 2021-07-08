import mongoose, { Schema, Document } from 'mongoose';

export enum Gender {
  male = 'male',
  female = 'female',
  undisclosed = 'undisclosed'
}

export interface IUser extends Document {
  email: string;
  description: string;  
  gender?: Gender;

}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true }, 
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
  country: {type: String}
});

// Export the model and return your IUser interface
export default mongoose.model<IUser>('User', UserSchema);

