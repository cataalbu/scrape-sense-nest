import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  NEST_TASKS_QUEUE_NAME: process.env.NEST_TASKS_QUEUE_NAME,
  NEST_TASKS_QUEUE_URL: process.env.NEST_TASKS_QUEUE_URL,
};
