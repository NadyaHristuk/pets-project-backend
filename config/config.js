module.exports = {
  MondoDB: {
    url:
      "mongodb+srv://user:123@cluster0.jkmtu.mongodb.net/pets_support??retryWrites=true&w=majority"
  },
  client: {
    development: {
      url: "http://localhost",
      port: "3000"
    }
  },
  jwt_encryption: process.env.JWT_ENCRYPTION || "jwt_please_change",
  jwt_expiration: process.env.JWT_EXPIRATION || 10000
};
