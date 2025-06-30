import db from "models";
import { isValid, parseISO, startOfDay, endOfDay } from "date-fns";
import { INote } from "models/note.model";

interface AddNoteInput {
  title: string;
  content: string;
  userId: string;
}


interface UpdateFields {
  title?: string;
  content?: string;
}


interface QueryNotesParams {
  userId: string;
  title?: string;
  date?: string; // ISO date string (e.g. "2025-06-29")
}

export const addNote = async (input: AddNoteInput) => {
  const note = await db.Note.create({
    title: input.title,
    content: input.content,
    userId: input.userId,
  });

  return note;
};


export const queryNotes = async ({ userId, title, date }: QueryNotesParams) => {
  const filter: any = { userId };

  // Match partial title using case-insensitive regex
  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }

  // Filter by date (createdAt)
  if (date) {
    const parsedDate = parseISO(date);
    if (isValid(parsedDate)) {
      filter.createdAt = {
        $gte: startOfDay(parsedDate),
        $lte: endOfDay(parsedDate),
      };
    }
  }

  const notes = await db.Note.find(filter).sort({ createdAt: -1 });

  return notes;
};


export const getNoteById = async (id: string) => {
    const note = await db.Note.findById(id);

    return note 
}


export const editNote = async (note: INote, fields:UpdateFields ) => {
  const { title, content } = fields;

  if (title !== undefined) {
    note.title = title;
  }

  if (content !== undefined) {
    note.content = content;
  }

  await note.save();

  return note;
}

export const deleteNote = async (id: string) => {
  await db.Note.findOneAndDelete({ _id: id });
  return;
}