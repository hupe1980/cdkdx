import * as path from 'path';
import axios from 'axios';

export const handler = async () => {
    console.log(path.join(__dirname));

    const response = await axios.get('http://google.com');
}