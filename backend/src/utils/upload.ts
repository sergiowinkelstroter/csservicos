import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Apenas imagens do tipo JPEG, JPG, PNG são permitidas"));
    }
  },
});

export const uploadMiddleware = upload.single("image");

export const deleteImage = (filename: string) => {
  const filePath = path.join(__dirname, "../../uploads", filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Erro ao deletar imagem:", err);
    }
  });
};

export default upload;
