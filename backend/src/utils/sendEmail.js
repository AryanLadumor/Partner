// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/*
ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html.

Purpose:
ses_sendemail.js demonstrates how to send an email using Amazon SES.

Running the code:
node ses_sendemail.js

*/
// snippet-start:[ses.JavaScript.email.sendEmailV3]
const { SendEmailCommand } = require("@aws-sdk/client-ses"); //!  first install it from nnpm
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, emailObj) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${emailObj?.msgHtml || "Here will be the body of HTML"}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: emailObj?.text || "Text Of Email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: emailObj?.subject || "Subject Of Email",  
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (emailObj) => {
  const sendEmailCommand = createSendEmailCommand(
    "tricoms1319@gmail.com",
    "partner@patner.xyz",
    emailObj,
  ); // if those are not verified in AWS then they will not go throught sandBox

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
