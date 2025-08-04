const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logEmailError = (email, token, errorMessage) => {
  const now = new Date();

  const yyyyMMdd = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().split(' ')[0];

  const fileName = `${yyyyMMdd}-mailerror.log`;
  const logMailFile = path.join(logDir, fileName);

  const logEntry = `${time}\n${email}\n${token}\n${errorMessage}\n\n`;

  fs.appendFile(logMailFile, logEntry, (err) => {
    if (err) {
      console.error('Error writing to email log:', err);
    }
  });
};

module.exports = logEmailError;