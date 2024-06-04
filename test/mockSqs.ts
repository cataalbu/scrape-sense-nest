// test/mocks/aws-sdk-client-sqs-mock.ts
import * as nock from 'nock';

const setupSqsMock = () => {
  nock('https://sqs.eu-central-1.amazonaws.com')
    .persist()
    .post('/')
    .reply(200, {
      SendMessageResponse: {},
    });
};

const cleanUpSqsMock = () => {
  nock.cleanAll();
};

export { setupSqsMock, cleanUpSqsMock };
