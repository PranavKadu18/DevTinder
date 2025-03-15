const { subDays, startOfDay, endOfDay } = require("date-fns");
var cron = require("node-cron");
const { ConnectionRequest } = require("../models/connectionReq");
const { run } = require("./sendEmail");

cron.schedule("0 8 * * *", async () => {
  try {
    var yesterday = subDays(new Date(), 1);

    var startOfYesterday = startOfDay(yesterday);
    var endOfYesterday = endOfDay(yesterday);

    const result = await ConnectionRequest.find({
      status: "Intrested",
      createdAt: {
        $gte: startOfYesterday,
        $lt: endOfYesterday,
      },
    }).populate("toUserId fromUserId");

    const uniqueEmails = [...new Set(result.map((req) => req.toUserId.email))];

    console.log(uniqueEmails);
   
    
    uniqueEmails.forEach(async (email,idx) => {
        try {
            const status = await run("MyTemplate", {
              name : result[idx].toUserId.firstName,
              url: "https://devcon.space/",
              time : new Date().toISOString()
            });
            // console.log(email);
            // console.log(status);
            //await delay(2000);
          } catch (error) {
            console.log("Error : " + error.message);
          }
    })

    
  } catch (error) {
    console.log("Error : " + error.message);
  }
});
