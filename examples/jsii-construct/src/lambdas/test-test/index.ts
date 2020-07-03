import * as path from 'path';
import axios from 'axios';

import { foo } from './ex';

export const handler = async () => {
    console.log(path.join(__dirname));

    console.log(foo);

    const response = await axios.get('http://google.com');

    console.log(response);
}