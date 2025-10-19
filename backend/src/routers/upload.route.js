import express from "express";
import { createRouteHandler } from "uploadthing/express";
import uploadRouter from "../lib/uploadthing.js";

const router = express.Router();

// Route untuk UploadThing
router.use(
  "/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {
      token: process.env.UPLOADTHING_TOKEN,
    },
  })
);

export default router;
