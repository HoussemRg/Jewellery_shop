const multer=require('multer');
const path=require('path');


const uploadProductPhoto=multer({
    storage:multer.memoryStorage(),
    fileFilter:(req,file,callback)=>{
        if(file.mimetype==='image/jpeg' || file.mimetype==='image/jpeg'){
            callback(null,true);
        }else{
            callback({message:"Only jpeg and png files are allowed"});
        }
    },
    limits:{fileSize:1024 * 1024}
})


module.exports={uploadProductPhoto}