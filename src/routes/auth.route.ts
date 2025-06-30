import express from "express";
import * as AuthControllers from "../controllers/auth.controller";
import {
  asyncHandler,
  validationHandler,
} from "../middlewares/error-handler.middleware";
import { loginSchema, registerUserSchema } from "../validators/schemas/user.schema";

const router = express.Router();

router.post(
  "/register",
  [validationHandler(registerUserSchema)],
  asyncHandler(AuthControllers.register)
).post('/login', [validationHandler(loginSchema)], asyncHandler(AuthControllers.login));

export default router;
