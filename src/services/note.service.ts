import { Request } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as NoteRepo from "../repositories/note.repo";
import { AppError } from "../errors/app-error";

/**
 * Add a new note to the database
 * - Only allows authenticated users
 * - Prevents duplicate titles
 */
export const addNote = async (req: AuthenticatedRequest) => {
  const userId = req?.user?.id!;

  if (!userId)
    throw AppError.unauthorized(
      "Unauthorized Access...You need to be Logged in"
    );

  const { title, content } = req.body;

  // Check for duplicate note title
  const note = await NoteRepo.findNoteByTitle(title);
  if (note) throw AppError.conflict("A note exists with this title");

  // Prepare and save new note
  const newNoteData = {
    title,
    content,
    userId,
  };

  await NoteRepo.addNote(newNoteData);
  return;
};

/**
 * Retrieve all notes for an authenticated user
 * - Supports filtering by title and date
 * - Supports pagination
 */
export const getAllNotes = async (req: AuthenticatedRequest) => {
  const userId = req?.user?.id!;

  if (!userId)
    throw AppError.unauthorized(
      "Unauthorized Access...You need to be Logged in"
    );

  const { title, date, page, limit } = req.query;

  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 20;
  const skip = (pageNumber - 1) * limitNumber;

  // Query notes using filters and pagination
  const allNotes = await NoteRepo.queryNotes({
    userId,
    title: title as string,
    date: date as string,
    skip,
    limit: limitNumber,
  });

  const totalCount = await NoteRepo.countNotes({
    userId,
    title: title as string,
    date: date as string,
  });

  if (allNotes.length === 0) throw AppError.notFound("Result Not Found!!!");

  return {
    notes: allNotes,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
      totalCount,
      hasNextPage: pageNumber < Math.ceil(totalCount / limitNumber),
      hasPrevPage: pageNumber > 1,
    },
  };
};

/**
 * View a specific note by ID
 * - User must be authenticated
 * - Validates existence of note
 */
export const viewNote = async (req: AuthenticatedRequest) => {
  const userId = req?.user?.id!;

  if (!userId)
    throw AppError.unauthorized(
      "Unauthorized Access...You need to be Logged in"
    );

  const { id } = req.params;

  const note = await NoteRepo.getNoteById(id);
  if (!note) throw AppError.notFound("Sorry, this note does not exist");

  return note;
};

/**
 * Edit an existing note
 * - Only allows note owner to edit
 * - Updates only provided fields (title or content)
 */
export const editNote = async (req: AuthenticatedRequest) => {
  const userId = req?.user?.id!;

  if (!userId)
    throw AppError.unauthorized(
      "Unauthorized Access...You need to be Logged in"
    );

  const { id } = req.params;
  const { title, content } = req.body;

  const note = await NoteRepo.getNoteById(id);
  if (!note) throw AppError.notFound("Sorry, this note does not exist");

  // Delegate update to repository
  await NoteRepo.editNote(note, { title, content });
  return;
};

/**
 * Delete a note by ID
 * - Ensures user is authenticated
 * - Verifies note existence before deletion
 */
export const deleteNote = async (req: AuthenticatedRequest) => {
  const userId = req?.user?.id!;

  if (!userId)
    throw AppError.unauthorized(
      "Unauthorized Access...You need to be Logged in"
    );

  const { id } = req.params;

  const note = await NoteRepo.getNoteById(id);
  if (!note) throw AppError.notFound("Sorry, this note does not exist");

  await NoteRepo.deleteNote(id);
  return;
};
