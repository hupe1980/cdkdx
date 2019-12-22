const path = require('path');
const axios = require('axios');

module.exports.handler = async () => {
    console.log(path.join(__dirname));

    const response = await axios.get('http://google.com');
}