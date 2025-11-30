import { createUploadthing } from "uploadthing/express";

const f = createUploadthing({
  token: process.env.UPLOADTHING_TOKEN,
});

// FileRouter untuk menangani upload file
export const uploadRouter = {
  // Upload gambar poster movie
  moviePoster: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Middleware untuk autentikasi jika diperlukan
      // const user = await getUser(req);
      // if (!user) throw new Error("Unauthorized");
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for movie poster:", file);
      return { uploadedBy: "user" };
    }),

  // Upload gambar hero section movie
  movieHeroImage: f({
    image: {
      maxFileSize: "6MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Middleware untuk autentikasi jika diperlukan
      // const user = await getUser(req);
      // if (!user) throw new Error("Unauthorized");
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for movie hero image:", file);
      return { uploadedBy: "user" };
    }),

  // Upload gambar trailer thumbnail
  trailerThumbnail: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for trailer thumbnail:", file);
      return { uploadedBy: "user" };
    }),

  // Upload multiple images (untuk gallery movie)
  movieGallery: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ req }) => {
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for movie gallery:", file);
      return { uploadedBy: "user" };
    }),

  // Upload user avatar/profile picture
  userAvatar: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user avatar:", file);
      return { uploadedBy: "user" };
    }),

  // Upload actor photo
  actorPhoto: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for actor photo:", file);
      return { uploadedBy: "user" };
    }),

  // Upload director photo
  directorPhoto: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for director photo:", file);
      return { uploadedBy: "user" };
    }),
};

export default uploadRouter;
