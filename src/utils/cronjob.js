const { subDays, startOfDay, endOfDay } = require("date-fns");
var cron = require("node-cron");
const { ConnectionRequest } = require("../models/connectionReq");
const { run } = require("./sendEmail")


cron.schedule("0 8 * * *",async () => {
    try {

        var yesterday = subDays(new Date(),1);
        
        var startOfYesterday = startOfDay(yesterday);
        var endOfYesterday = endOfDay(yesterday);

        const result = await ConnectionRequest.find({
            status : "Intrested",
            createdAt : {
                $gte : startOfYesterday,
                $lt : endOfYesterday
            }
        }).populate("toUserId fromUserId")

        const uniqueEmails = [...new Set(result.map(req => req.toUserId.email))];

        for(const email of uniqueEmails){
            const status = run("Check connection request for " + email,"You are getting liked your rizz is sky rocketing check your account now");
        }
        
        
    } catch (error) {
        console.log("Error : " + error.message);
    }
})