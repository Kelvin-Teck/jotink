import Joi from "joi";

export const registerUserSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must not exceed 30 characters",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } }) // disable strict TLD validation for flexibility
    .required()
    .messages({
      "string.email": "A valid email is required",
      "string.empty": "Email is required",
    }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),

  avatarUrl: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Avatar URL must be a valid URI",
  }),

  role: Joi.string()
    .valid("user", "premium", "admin")
    .optional()
    .default("user")
    .messages({
      "any.only": "Role must be one of user, premium, or admin",
    }),
});



export const loginSchema = Joi.object({
  identifier: Joi.alternatives()
    .try(
      Joi.string().email({ tlds: { allow: false } }),
      Joi.string().min(3).max(30)
    )
    .required()
    .messages({
      "alternatives.match": "Identifier must be a valid email or username",
      "string.empty": "Identifier is required",
    }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
});
