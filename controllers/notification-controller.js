
const PushSubscription = require('../models/push-subscription');
const webpush = require('web-push');
webpush.setVapidDetails(`mailto:${process.env.MAILTO}`,process.env.PUBLIC_VAPID ,process.env.PRIVATE_VAPID )

exports.getSubscriptions = async (req, res, next) => {

    console.log("Get subscriptions")
    
    try {
        notifications =  await  PushSubscription.find();
       
        res.status(200).json({
            message: "subscriptions listed successfully",
            notifications: notifications
          });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
          }
          next(error);
    }
};

exports.subscribe = async (req, res, next) => {
    const subscription = req.body
    const pushSub = new PushSubscription({
        endpoint : subscription.notificationEndPoint,
        keys : {
          p256dh : subscription.publicKey,
          auth:subscription.auth 
        }
         });
    try {
      const sub =  await pushSub.save();
      res.status(200).json({
        message: "subscription created successfully",
        sub: sub
      });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
          }
          next(error);
    }
};



exports.unsubscribe = async (req, res, next) => {
    const { notificationEndPoint } = req.params;
    try {
      pushSub = await  PushSubscription.findOne({endpoint: notificationEndPoint})
      if(pushSub){
        await  PushSubscription.remove(pushSub)
      }
      res.status(200).json({
        message: "subscription deleted successfully"
      });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
          }
          next(error);
    }
    
};



exports.send = async (req, res, next) => {
  const notification = req.body;
  console.log(notification);
  
  const notificationPayload = {
    notification: {
      title: 'Calcapp.io news!',
      body: notification.message,
      icon: 'https://raw.githubusercontent.com/fhabumugisha/calcapp-ngclient/master/src/assets/icons/icon-96x96.png',
    },
  }

  try {
    const promises = []
   const subscriptions  =  await PushSubscription.find();
   subscriptions.forEach(subscription => {
      promises.push(
        webpush.sendNotification(
          subscription,
          JSON.stringify(notificationPayload)
        )
      )
    })
    Promise.all(promises).then(() => {
      res.status(200).json({
        message: "subscription deleted successfully"
      })
    }).catch((error) => {
      console.log(error);
    });
  } catch (error) {
      if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
  }
};