import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";

const userController = {
  createUser: async (sol, req) => {
    try {
      const { name, email, password, role } = sol.body;
      const protectedPassword = await bcrypt.hash(password, 10);
      const newUser = new userModel({
        name,
        email,
        password: protectedPassword,
        role,
        state: true,
      });
      const creatingUser = await newUser.save();
      if (creatingUser._id) {
        req.json({
          state: "Success",
          mesage: "User created",
          data: creatingUser._id,
        });
      }
    } catch (error) {
      req.json({
        state: "Error",
        mesage: "Error creating user",
        data: error,
      });
    }
  },

  readAllUsers: async (sol, req) => {
    try {
      const searchingAllUsers = await userModel.find();
      req.json({
        state: "Success",
        mesage: "Users found",
        data: searchingAllUsers,
      });
    } catch (error) {
      req.json({
        state: "Error",
        mesage: "Error finding all users",
        data: error,
      });
    }
  },

  readUser: async (sol, req) => {
    try {
      const searchingUser = await userModel.findById(sol.params.id);
      if (searchingUser._id) {
        req.json({
          state: "Success",
          mesage: "User found",
          data: searchingUser,
        });
      }
    } catch (error) {
      req.json({
        state: "Error",
        mesage: "Error finding user",
        data: error,
      });
    }
  },

  updateUser: async (sol, req) => {
    try {
      const { password, ...updateData } = sol.body;

      if (password) {
        const protectedPassword = await bcrypt.hash(password, 10);
        updateData.password = protectedPassword;
      }

      const updatingUser = await userModel.findByIdAndUpdate(
        sol.params.id,
        updateData,
        { new: true } // Esto devuelve el usuario actualizado
      );

      if (updatingUser._id) {
        req.json({
          state: "Success",
          mesage: "User updated",
          data: updatingUser._id,
        });
      }
    } catch (error) {
      req.json({
        state: "Error",
        mesage: "Error updating user",
        data: error,
      });
    }
  },

  deleteUser: async (sol, req) => {
    try {
      const deletingUser = await userModel.findByIdAndDelete(sol.params.id);
      if (deletingUser._id) {
        req.json({
          state: "Success",
          mesage: "User deleted",
          data: null,
        });
      }
    } catch (error) {
      req.json({
        state: "Error",
        mesage: "Error deleting user",
        data: error,
      });
    }
  },
};

export default userController;
