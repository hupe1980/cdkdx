import { Handler } from 'aws-lambda';
import axios from 'axios';

import { shared } from '../shared';

export const handler: Handler = async () => {
  console.log(shared);

  const response = await axios.get('http://google.com');

  console.log(response);
};
