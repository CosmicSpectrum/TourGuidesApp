const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middlewares/auth');
const s3Manager = require('filestorage');
const FileUpload = require('express-fileupload');
const FileMetadata = require('../models/filtesMetadata');

const S3 = new s3Manager(process.env.AWS_ACCESS_KEY,process.env.AWS_SECRET_KEY,process.env.PROJECT_BUCKET);

router.use(authenticationMiddleware);
router.use(FileUpload());

router.post('/upload',(req,res)=>{
    const {file} = req.files;
    try{
        S3.upload(file.data).then(fileStatus=>{
            const fileMeta = new FileMetadata({
                uid: fileStatus.fileKey,
                mimeType: file.mimetype
            });
            fileMeta.save(err=>{
                if(err) throw new Error(err);

                return res.status(200).json({status: true, fileKey: fileStatus.fileKey});
            })
        }).catch(err=>{
            throw new Error(err);
        })
    }catch(err){
        console.log(err);
        return res.status(500).send("something went wrong");
    }
});

router.get('/download', (req,res)=>{
    const {fileKey} = req.query;
    try{
        S3.download(fileKey).then(file=>{
            if(file){
                FileMetadata.findOne({uid: fileKey},["mimeType"],(err,doc)=>{
                    if(err) throw new Error(err);

                    return res.status(200).json({buffer: file.Body , mimeType: doc.mimeType});
                })
            }
        }).catch(err=>{
            throw new Error(err);
        })
    }catch(err){
        console.log(err);
        return res.status(500).send("somthing went wrong");
    }
})

router.delete('/delete',(req,res)=>{
    const {fileKey} = req.query;
    try{
        S3.delete(fileKey).then(result=>{
            if(Object.keys(result).length === 0){
                FileMetadata.deleteOne({uid: fileKey},(err,result)=>{
                    if(err) throw new Error(err);
                })

                return res.status(200).json({status: true});
            }
        }).catch(err=>{
            throw new Error(err);
        })
    }catch(err){
        return res.status(500).send('somthing went wrong');
    }
})


module.exports = router;