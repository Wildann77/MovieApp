import { Router } from "express";
import { 
    getCurrentUserController, 
    updateUserProfileController,
    addToFavoritesController,
    removeFromFavoritesController,
    getFavoritesController,
    toggleFavoriteController
} from "../controllers/user.controller.js";
import { protect } from "../middleware/verifyToken.js";

const router = Router();

// User routes (protected)
router.get("/current", protect, getCurrentUserController);
router.put("/profile", protect, updateUserProfileController);

// Favorites routes
router.get("/favorites", protect, getFavoritesController);
router.post("/favorites/:movieId", protect, addToFavoritesController);
router.delete("/favorites/:movieId", protect, removeFromFavoritesController);
router.patch("/favorites/:movieId/toggle", protect, toggleFavoriteController);

export default router;