const express = require('express');
const multer = require('multer');
const router = express.Router()



const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `company-logo.${ext}`);
    }
})

const companyController = require('../controller/company');
const upload = multer({storage: fileStorage});

router.get('/company', companyController.getCompany);
router.post('/upload-company-logo', upload.single('image'), companyController.uploadCompanyLogo);
router.post('/company', companyController.insertCompany);
module.exports = router