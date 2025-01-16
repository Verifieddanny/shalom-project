const { randomBytes } = require('crypto');

const generateRandomCode = () => randomBytes(4).toString('hex'); // Generates an 8-character hex code

module.exports = generateRandomCode;
