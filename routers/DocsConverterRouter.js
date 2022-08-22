const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

const router = express.Router();


var outputFilePath

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "pdf/uploads");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});


const docxtopdfdemo = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (
        ext !== ".docx"
    ) {
        return callback("This Extension is not supported");
    }
    callback(null, true);
};

const docxtopdfdemoupload = multer({ storage: storage, })


// router.post('/', docxtopdfdemoupload.single('file'), (req, res) => {
//     if (req.file) {
//         console.log(req.file.path)

//         const file = fs.readFileSync(req.file.path);

//         outputFilePath = Date.now() + "output.pdf";

//         console.log(outputFilePath)


//         libre.convert(file, ".pdf", undefined, async (err, done) => {
//             if (err) {
//                 // fs.unlinkSync(req.file.path)
//                 // fs.unlinkSync(outputFilePath)

//                 res.send("some error taken place in conversion process")
//             }

//             fs.writeFileSync(outputFilePath, done);

//             res.download(outputFilePath, (err) => {
//                 if (err) {
//                     // fs.unlinkSync(req.file.path)
//                     // fs.unlinkSync(outputFilePath)

//                     res.send("some error taken place in downloading the file")
//                 }

//                 // fs.unlinkSync(req.file.path)
//                 // fs.unlinkSync(outputFilePath)
//             })


//         })
//     }
// })


router.post('/', docxtopdfdemoupload.single('file'), async (req, res) => {

    try {
        const ext = '.pdf'
        const file = await fs.readFile(req.file.path);
        outputPath = Date.now() + "output.pdf";
        // const outputPath = path.join(__dirname, `/pdf/uploads/example${ext}`);


        let pdfBuf = await libre.convertAsync(file, ext, undefined);
        console.log("am converted");

        await fs.writeFile(outputPath, pdfBuf);

        res.download(outputPath, (err) => {
            if (err) {
                res.send("some error taken place in downloading the file")
            }
        })
    } catch (error) {
        console.error(error)
    }

})


module.exports = router;