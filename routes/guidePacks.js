const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middlewares/auth');
const s3Manager = require('filestorage');
const FileUpload = require('express-fileupload');
const FileMetadata = require('../models/filtesMetadata');
const Users = require('../models/users');
const GuidePack = require('../models/guidePack');
const {Types} = require('mongoose')

const S3 = new s3Manager(process.env.AWS_ACCESS_KEY,process.env.AWS_SECRET_KEY,process.env.PROJECT_BUCKET);

router.use(FileUpload());

router.post('/upload',authenticationMiddleware, (req,res)=>{
    const {file} = req.files;
    const {fileName, isPublic, fileOwner} = req.body;
    try{
        S3.upload(file.data).then(fileStatus=>{
            const fileMeta = new FileMetadata({
                uid: fileStatus.fileKey,
                mimeType: file.mimetype,
                fileName,
                isPublic,
                fileOwner
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
                FileMetadata.findOne({uid: fileKey},["mimeType", 'fileName'],(err,doc)=>{
                    if(err) throw new Error(err);

                    res.writeHead(200, {
                        'Content-Type': doc.mimeType,
                        'Content-disposition': 'attachment;filename=file',
                        'Content-Length': file.ContentLength
                    });
                    res.end(file.Body);
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

router.delete('/delete',authenticationMiddleware,(req,res)=>{
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
        console.log(err);
        return res.status(500).send('somthing went wrong');
    }
})

router.get('/getUserFiles',authenticationMiddleware, (req,res)=>{
    try{
        FileMetadata.find({fileOwner: req.user._id}, 
            ["uid","mimeType","isPublic","fileName","fileOwner"],(err, docs)=>{
            if(err) throw new Error(err);

            return res.status(200).json({files: docs});
        })
    }catch(err){
        console.log(err);
        return res.status(500).send("something went wrong");
    }
})

router.get("/getPublicFiles",authenticationMiddleware, (req,res)=>{
    try{
        FileMetadata.find({isPublic: true},
            ["uid","mimeType","isPublic","fileName","fileOwner"], (err, docs)=>{
                if(err) throw new Error(err);

                return res.status(200).json({files: docs});
            } )
    }catch(err){
        console.error(err);
        return res.status(500).send('something went wrong');
    }
})

router.get('/getPackById',authenticationMiddleware, (req,res)=>{
    const {packId} = req.query;
    try{
        GuidePack.findOne({_id: Types.ObjectId(packId)}, (err, pack)=>{
            if(err) throw err;

            return res.status(200).json(pack);
        })
    }catch(err){
        return res.status(500).send('something went wrong');
    }
})

router.get('/getAutocompleteList',authenticationMiddleware, (req,res)=>{
    try{
        const packsArray = [];
        GuidePack.find(
            {$or: [{_id: {$in: req.user.guidePacks}}, {isPublic: true}]},
            ['_id', 'packName'],
            (err, packs)=>{
                if(err) throw err;

                packs.map(pack=>{
                    packsArray.push({id: pack._id, label: pack.packName});
                })

                return res.status(200).json(packsArray)
            })
    }catch(err){
        return res.status(500).send('something went wrong');
    }
})

router.post('/createPack',authenticationMiddleware,async  (req,res)=>{
    const {packName, packItems, isPublic} = req.body;
    try{
        const pack = new GuidePack({
            packName,
            packItems,
            isPublic,
            packOwner: req.user._id
        })

        await pack.save();

        const user = await Users.findOne({_id: req.user._id});

        if(user){
            user.guidePacks.push(pack._id);
            Users.replaceOne({_id: user._id}, user, (err, result)=>{
                if(err) throw err;

                return res.status(200).json({status: true});
            })
        }
    }catch(err){
        console.log(err);
        return res.status(500).send("something went wrong");
    }
})

router.put('/updatePack',authenticationMiddleware, async (req,res)=>{
    const pack = req.body;
    try{
        await GuidePack.replaceOne({_id: pack._id}, pack);
        return res.status(200).json({status: true});
    }catch(err){
        console.log(err);
        return res.status(500).send('something went wrong');
    }
})

router.get('/getUserPacks',authenticationMiddleware, async (req,res)=>{
    try{
        const userPacks = await GuidePack.find({_id: {$in: req.user.guidePacks}});

        return res.status(200).json(userPacks);
    }catch(err){
        return res.status(500).send('something went wrong');
    }
});

router.get("/getPublicPacks",authenticationMiddleware, (req,res)=>{
    try{
        GuidePack.find({isPublic: true}, (err, docs)=>{
            if(err) throw new Error(err);

            return res.status(200).json(docs);
        })
    }catch(err){
        console.error(err);
        return res.status(500).send('something went wrong');
    }
})

router.delete('/deletePack',authenticationMiddleware, (req,res)=>{
    const {packId} = req.query;
    try{
        Users.findOne({_id: req.user._id}, (err, user)=>{
            const indexToRemove = user.guidePacks.findIndex(pack => packId === pack);
            user.guidePacks.splice(indexToRemove, 1);
            user.save(err=>{
                if(err) throw err;
                GuidePack.deleteOne({_id: Types.ObjectId(packId)}, (err)=>{
                    if(err) throw err;

                    return res.status(200).json({status: true});
                })
            })
        })
    }catch(err){
        return res.status(500).send("something went wrong");
    }
})

module.exports = router;