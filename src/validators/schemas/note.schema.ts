import Joi from "joi";

export const createNoteSchema = Joi.object({
  title: Joi.string().trim().max(150).required().messages({
    "string.empty": "Title is required",
    "string.max": "Title must be at most 150 characters",
  }),

  content: Joi.string().trim().required().messages({
    "string.empty": "Content is required",
  }),
});

export const updateNoteSchema = Joi.object({
  title: Joi.string().trim().max(150).optional().messages({
    "string.max": "Title must be at most 150 characters",
  }),

  content: Joi.string().trim().min(1).optional().messages({
    "string.min": "Content cannot be empty",
  }),
})
  .or("title", "content") // require at least one field
  .messages({
    "object.missing":
      "At least one field (title or content) must be provided to update the note",
  });
