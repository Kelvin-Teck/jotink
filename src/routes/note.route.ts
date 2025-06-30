import express from "express";
import * as NoteController from "../controllers/note.controller";
import {
  asyncHandler,
  validationHandler,
} from "../middlewares/error-handler.middleware";
import { createNoteSchema, updateNoteSchema } from "../validators/schemas/note.schema";
import { authenticate } from "../middlewares/auth.middleware";
const router = express.Router();

router
  .get("/all-notes", [authenticate], asyncHandler(NoteController.getAllNotes))
    .get("/single-note/:id", [authenticate], asyncHandler(NoteController.viewNote));
  
router.post(
  "/add",
  [authenticate, validationHandler(createNoteSchema)],
  asyncHandler(NoteController.addNote)
);

router.patch('/edit-note/:id', [authenticate, validationHandler(updateNoteSchema)], asyncHandler(NoteController.editNote))

router.delete('/delete-note/:id', [authenticate], asyncHandler(NoteController.deleteNote))

export default router;
