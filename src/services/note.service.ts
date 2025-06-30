import { Request } from "express";
import { AuthenticatedRequest } from "middlewares/auth.middleware";
import * as NoteRepo from "../repositories/note.repo";
import { AppError } from "errors/app-error";

export const addNote = async (req: AuthenticatedRequest) => {
  const userId = req?.user?.id!;

  if (!userId)
    throw AppError.unauthorized(
      "Unauthorized Access...You need to be Logged in"
    );


  const { title, content } = req.body;

  const newNoteData = {
    title,
    content,
    userId,
  };

  await NoteRepo.addNote(newNoteData);
  return;
};

export const getAllNotes = async (req: AuthenticatedRequest) => {
  const userId = req?.user?.id!;

  if (!userId)
    throw AppError.unauthorized(
      "Unauthorized Access...You need to be Logged in"
    );


  const { title, date } = req.query;

  const allNotes = await NoteRepo.queryNotes({
    userId,
    title: title as string,
    date: date as string,
  });

  if (allNotes.length === 0) throw AppError.notFound("Result Not Found!!!");

  return allNotes;
};

export const viewNote = async (req: AuthenticatedRequest) => {
  const userId = req?.user?.id!;

  if (!userId)
    throw AppError.unauthorized(
      "Unauthorized Access...You need to be Logged in"
    );

  const { id } = req.params;

  const note = await NoteRepo.getNoteById(id);

  if (!note) throw AppError.notFound("Sorry this note does not exist");

  return note;
};

export const editNote = async (req: AuthenticatedRequest) => {
  const userId = req?.user?.id!;

  if(!userId) throw AppError.unauthorized('Unauthorized Access...You need to be Logged in')

  const { id } = req.params;


  const { title, content } = req.body;

  const note = await NoteRepo.getNoteById(id);

  if (!note) throw AppError.notFound("Sorry this note does not exist");

  await NoteRepo.editNote(note, { title, content });

  return;
};


export const deleteNote = async (req: AuthenticatedRequest) => {
  const userId = req?.user?.id!;


  if (!userId)
    throw AppError.unauthorized(
      "Unauthorized Access...You need to be Logged in"
    );

  const { id } = req.params;

  const note = await NoteRepo.getNoteById(id);

  if (!note) throw AppError.notFound('Sorry this note does not exist')
  
  await NoteRepo.deleteNote(id);

  return
}