const mockito = require('ts-mockito');
const aws = require('@aws-sdk/client-sqs');
const mock = mockito.mock;

const mock1 = mock(aws.SQS);
const ins = mockito.instance(mock1);

console.log(ins);
