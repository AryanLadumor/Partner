const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/ConnectionRequest.js");
const sendEmail = require("./sendEmail.js");


/*
* * * * * *
1st star ==> run very second (optional)
2nd star ==> run every miniut
3rd star ==> run every hour
4th star ==> run every day
5th star ==> run every month
6th star ==> run every day of week

0 8 * * * ==> evry day at 8am 
*/
// visit https://crontab.guru  for easy visulization

cron.schedule("0 8 * * *", async () => {
  try {
    //Fetching the yesterday start and end time i.e. 00:00 and 23:59
    const yesterday = subDays(new Date(), 0);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);



    ///finding all requests that are being interrested yesterday
    const pendingRequest = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");
    console.log(pendingRequest)

    //filtering all unquie email to whom req is sended and putting them into a list
    const listOfEmails = new Set(
      pendingRequest.map((req) => req.toUserId.emailId),
    );
    console.log(listOfEmails);
    for (const email of listOfEmails) {
      try {
        //Sending the email
        const emailObj = {
          subject: "New Friend Request pendin for " + email,
          msg: "please login to patner.xyz and accept or reject it",
        }; 
        const res = await sendEmail.run(emailObj);

        console.log(res);
      } catch (error) {
        console.log(error)
      }
    }
  } catch (error) {
    console.log(error);
  }
});



//this is syncronous way of sending email this is blocking our code, we  can provide more optimised way by queing thing or using package like Bee Queue,bull
//explore queue mechanisms to send bulk message  
//Amazon ses bulk




