const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; 
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);


/*
storeSchema.pre('save',function(next){
    const store=this;
    if (store.isModified('storeName')) {
        store.storeName = encrypt(store.storeName).encryptedData;
    }
    if (store.isModified('address')) {
        store.address = encrypt(store.address).encryptedData;
    }
    if (store.isModified('description')) {
        store.description = encrypt(store.description).encryptedData;
    }
    if (store.isModified('database')) {
        store.description = encrypt(store.description).encryptedData;
    }
    next();
    
});
*/

function encrypt(text) {
   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}


function decrypt(text) {
   let iv = Buffer.from(text.iv, 'hex');
   let encryptedText = Buffer.from(text.encryptedData, 'hex');
   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
}

module.exports={encrypt,decrypt}