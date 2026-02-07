const crypto = require("crypto");

const generateHash = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

const hashToBytes32 = (hexHash) => {
  return "0x" + hexHash;
};

module.exports = { generateHash, hashToBytes32 };
