import * as path from 'path';
import axios from 'axios';

import { foo } from './ex';
import { shared } from '../shared';

export const handler = async () => {
  console.log(path.join(__dirname));

  console.log(foo, shared);

  const response = await axios.get('http://google.com');
};