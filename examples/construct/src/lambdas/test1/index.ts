import axios from 'axios';

import { shared } from '../shared';

import type { Handler } from 'aws-lambda';

export const handler: Handler = async () => {
  console.log(shared);

  const response = await axios.get('http://google.com');

  console.log(response);
};
