import express from "express";
import multer, { diskStorage } from "multer";
import path from "path";

const app = express();
const PORT = 3000;

// Set up storage engine
const storage = diskStorage({
	destination: "./uploads",
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

// Initialize upload variable
const upload = multer({
	storage,
	limits: { fileSize: 1000000 }, // 1MB limit
	fileFilter: (req, file, cb) => {
		const filetypes = /jpeg|jpg|png|gif/;
		const extname = filetypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		const mimetype = filetypes.test(file.mimetype);

		if (mimetype && extname) {
			return cb(null, true);
		} else {
			cb("Error: Images Only!");
		}
	},
}).single("file");

// Middleware to handle file upload
app.get("/", (req, res) => {
	res.send("Hello World");
});

app.post("/upload", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.status(400).send({
				message: "Failed to upload file",
				error: err,
			});
		} else {
			if (req.file === undefined) {
				res.status(400).send({
					message: "No file selected",
				});
			} else {
				res.status(200).send({
					message: "File uploaded successfully",
					file: req.file,
				});
			}
		}
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
