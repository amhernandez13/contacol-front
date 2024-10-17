import { Router } from "express";
import userController from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/", userController.createUser);
userRouter.get("/", userController.readAllUsers);
userRouter.get("/:id", userController.readUser);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
