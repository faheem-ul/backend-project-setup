import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //understanding the parameters of the function which are req, file and cb
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
    console.log("File log of multer", file);
  },
});

export const upload = multer({ storage: storage });
