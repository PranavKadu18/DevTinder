const { SendTemplatedEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");




const createSendTemplatedEmailCommand = (toAddress, fromAddress, templateName, templateData) => {
  return new SendTemplatedEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Source: fromAddress,
    Template: templateName,
    TemplateData: JSON.stringify(templateData),
  });
};


const run = async (templateName, templateData) => {
  const sendTemplatedEmailCommand = createSendTemplatedEmailCommand(
    "pranavkadu2003@gmail.com", 
    "pranav@devcon.space",
    templateName,
    templateData
  );

  try {
    return await sesClient.send(sendTemplatedEmailCommand);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
  
  
  module.exports = { run };