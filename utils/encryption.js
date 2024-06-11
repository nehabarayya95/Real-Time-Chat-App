const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = process.env.ENCRYPTION_KEY;

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return  `${iv.toString('hex')}: ${encrypted.toString('hex')}`;
}

const decrypt = (hash) => {
    const [iv, encrypted] = hash.split(':');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);
    return decrypted.toString();
}

module.exports = { encrypt, decrypt };