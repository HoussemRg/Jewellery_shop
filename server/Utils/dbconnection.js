const mongoose=require('mongoose');

let connections={

}

const getConnection=(dbName)=>{
    
    if(connections[dbName]){
        
        return connections[dbName];
        
    }
    const connection=mongoose.createConnection(`${process.env.DB_URI_P1}${dbName}${process.env.DB_URI_P2}`);
    connections[dbName]=connection;

    
    return connection;
}

module.exports={getConnection,connections}