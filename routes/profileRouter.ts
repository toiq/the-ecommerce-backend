import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addAddress,
  deleteAddress,
  getProfile,
  updateAddress,
  updateProfile,
} from "../controllers/profileController.js";
import errorHandler from "../handlers/error-handler.js";
import { cloudUploadMiddleware } from "../middlewares/cloudUploadMiddleware.js";

const profileRouter: Router = Router();

// Get the authenticated user's profile
profileRouter.get("/", [authMiddleware("ACCESS")], errorHandler(getProfile));

// Update the authenticated user's profile
profileRouter.put(
  "/",
  [
    authMiddleware("ACCESS"),
    cloudUploadMiddleware(
      [
        {
          name: "profile-image",
        },
      ],
      "profiles"
    ),
  ],
  errorHandler(updateProfile)
);

// Add a new address to the user's profile
profileRouter.post(
  "/address",
  [authMiddleware("ACCESS")],
  errorHandler(addAddress)
);

// Update an existing address
profileRouter.put(
  "/address/:addressId",
  [authMiddleware("ACCESS")],
  errorHandler(updateAddress)
);

// Delete an address from the profile
profileRouter.delete(
  "/address/:addressId",
  [authMiddleware("ACCESS")],
  errorHandler(deleteAddress)
);

export default profileRouter;
