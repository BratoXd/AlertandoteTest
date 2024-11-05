const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
require('dotenv').config();

const router = express.Router();

// Configuración de AWS S3
const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Configuración de multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

     const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `uploads/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    const s3Upload = s3.upload(uploadParams);
 
    s3Upload.send((error, data) => {
        if (error) {
            console.error('Error uploading file:', error);
            return res.status(500).json({ message: 'Error en la subida del archivo', error });
        }
        console.log('Archivo subido exitosamente a S3:', data);
        res.status(200).json({
            message: "Archivo subido exitosamente a S3",
            file: data.Location
        });
    });
});

module.exports = router;
