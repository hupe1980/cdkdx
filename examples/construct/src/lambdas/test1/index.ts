import axios from 'axios';

import { shared } from '../shared';

export const handler = async () => {
    console.log(shared);

    const response = await axios.get('http://google.com');
}