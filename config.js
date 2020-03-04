const dbName = 'task-manager';
const dbUsername = 'anastasia';
const dbPassword = 'anastasia';

exports.PORT = process.env.PORT || 8080;

exports.MONGO_URI = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0-di5r8.mongodb.net/${dbName}?retryWrites=true&w=majority`;
