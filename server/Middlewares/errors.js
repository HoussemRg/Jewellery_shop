//------------------Error handler middleware-------------------//
//ERROR 500 ////


const errorHandler=(err,req,res,next)=>{
    const statusCode=res.statusCode===200 ? 500 : res.statusCode;
    if (err.name === 'MulterError') {
        statusCode = 400; // Bad Request
    }
    res.status(statusCode).send(err.message);
}

//------------------NOT FOUND middleware-------------------//

/// ERROR 404 (NOT FOUND)  /////
const notFound=(req,res,next)=>{
    const error=new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);  // give the work to the error handler now
}



module.exports={errorHandler,notFound};