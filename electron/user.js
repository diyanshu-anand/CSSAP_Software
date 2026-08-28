const fs = require('fs');
const path = require('path');

const userPath = path.join(__dirname, 'user.json');

function saveUser(user) {
  fs.writeFileSync(userPath, JSON.stringify(user));
}

function getUser() {
  if (fs.existsSync(userPath)) {
    return JSON.parse(fs.readFileSync(userPath));
  }
  return null;
}

module.exports = { saveUser, getUser };