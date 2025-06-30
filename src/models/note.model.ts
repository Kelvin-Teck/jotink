import mongoose, { Schema, Document, model } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId; // assuming each note belongs to a user
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false, // removes __v
  }
);

// Optional: Create compound index for search/filter performance
noteSchema.index({ userId: 1, createdAt: -1 });

 const NoteModel = model<INote>("Note", noteSchema);

 export default NoteModel