const jwt=require('jsonwebtoken');

function verifyToken(req,res,next){
    const authToken=req.headers.authorization;
    if(authToken){
        const token=authToken.split(" ")[1];
        try{
            const decodedPayload=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decodedPayload;
            next();
        }catch(err){
            return res.status(401).send('Invalid token,Acess denied!');
        }
    }else{
        return res.status(401).send('Token not provided,Acess denied!');
    }   
}

function verifyTokenForOnlySuperAdmin(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.role=="superAdmin"){
            next();
        }else{
            return res.status(403).send("unothorized, Acess denied !");
        }
    })
}

function verifyTokenForOnlySuperAdminOrAdmin(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.role=="superAdmin" || req.user.role=="admin"){
            next();
        }else{
            return res.status(403).send("unothorized, Acess denied !");
        }
    })
}

module.exports={verifyToken,verifyTokenForOnlySuperAdmin,verifyTokenForOnlySuperAdminOrAdmin};