import { Router } from "express";
import * as UserController from "../controllers/user.controller";

export const userRoutes = Router();

userRoutes.get("/", UserController.getUsers);
userRoutes.get("/:id", UserController.getUserById);
userRoutes.post("/", UserController.createUser);
userRoutes.put("/:id", UserController.updateUser);
userRoutes.patch("/:id", UserController.patchUser);
userRoutes.delete("/:id", UserController.deleteUser);