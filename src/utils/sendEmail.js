// const { SendEmailCommand } = require("@aws-sdk/client-ses");
// const { sesClient } = require("./sesClient");




// const createSendEmailCommand = (toAddress, fromAddress) => {
//     return new SendEmailCommand({
//       Destination: {
//         /* required */
//         CcAddresses: [
//           /* more items */
//         ],
//         ToAddresses: [
//           toAddress,
//           /* more To-email addresses */
//         ],
//       },
//       Message: {
//         /* required */
//         Body: {
//           /* required */
//           Html: {
//             Charset: "UTF-8",
//             Data: "<h1>This is email in HTML format.</h1>",
//           },
//           Text: {
//             Charset: "UTF-8",
//             Data: "This is body in text format",
//           },
//         },
//         Subject: {
//           Charset: "UTF-8",
//           Data: "Hello World from SES",
//         },
//       },
//       Source: fromAddress,
//       ReplyToAddresses: [
//         /* more items */
//       ],
//     });
//   };


//   const run = async () => {
//     const sendEmailCommand = createSendEmailCommand(
//       "pranavkadu2003@gmail.com",
//       "pranav@devcon.space",
//     );
  
//     try {
//       return await sesClient.send(sendEmailCommand);
//     } catch (caught) {
//       if (caught instanceof Error && caught.name === "MessageRejected") {
//         const messageRejectedError = caught;
//         return messageRejectedError;
//       }
//       throw caught;
//     }
//   };
  
//   // snippet-end:[ses.JavaScript.email.sendEmailV3]
//   module.exports = { run };