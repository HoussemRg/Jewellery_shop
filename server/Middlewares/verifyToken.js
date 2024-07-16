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

module.exports={verifyToken};