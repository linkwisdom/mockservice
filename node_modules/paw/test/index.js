var paw = require('../index');

var moment = paw.require('moment');

console.log(moment.utc(-1).format('YYYY-MM-DD'));