const crypto = require('crypto');

// this usually takes a few seconds
function work(id, limit = 10) {
  let start = Date.now();
  n = 0;
  while(n < limit) {
    crypto.randomBytes(2048);
    n++;
  }
  return {
    id: id,
    timeElapsed: Date.now() - start,
    pid: process.pid
  };
}

module.exports = work;
