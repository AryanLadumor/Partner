// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/*
ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/ses-examples.html.

Purpose:
sesClient.js is a helper function that creates an Amazon Simple Email Services (Amazon SES) service client.

*/
// snippet-start:[ses.JavaScript.createclientv3]
const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region. this should be the one tthat we are currently on
const REGION = "ap-south-1";
// Credentials are automatically resolved using the AWS SDK credential provider chain.
// For more information, see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: { //very imp this is not provided into the docs we should be providing credentials
    accessKeyId: process.env.AWS_ACESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  },
});
module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
