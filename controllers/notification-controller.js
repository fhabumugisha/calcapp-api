const { validationResult } = require("express-validator");
const PushSubscription = require("../models/push-subscription");
const Notification = require("../models/notification");
const webpush = require("web-push");
webpush.setVapidDetails(
  `mailto:${process.env.MAILTO}`,
  process.env.PUBLIC_VAPID,
  process.env.PRIVATE_VAPID
);

exports.getSubscriptions = async (req, res, next) => {
  console.log("Get subscriptions");

  try {
    notifications = await PushSubscription.find();

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
  const subscription = req.body;
  const pushSub = new PushSubscription({
    endpoint: subscription.notificationEndPoint,
    keys: {
      p256dh: subscription.publicKey,
      auth: subscription.auth
    }
  });
  try {
    const sub = await pushSub.save();
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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { notificationEndpoint } = req.query;
    console.log(notificationEndpoint);
    
    const pushSub = await PushSubscription.findOne({
      endpoint: notificationEndpoint
    });
    if (pushSub) {
      await PushSubscription.remove(pushSub);
    }else{
      
        const error = new Error("Could not find project.");
        error.statusCode = 404;
        throw error;
      
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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { title, message, imageUrl } = req.body;
    const notification = new Notification({
      title,
      message,
      imageUrl
    });
    const dbNotif = await notification.save();

    const notificationPayload = {
      notification: {
        title: title || "Calcapp.io  News!",
        body: message || "New notification",
        icon:
          "https://raw.githubusercontent.com/fhabumugisha/calcapp-ngclient/master/src/assets/icons/icon-96x96.png",
        image: imageUrl || "https://i.picsum.photos/id/0/600/200.jpg",
        data: {
          url: "/notifications?id=" + dbNotif._id + "&utm_source=pushnotif"
        },
        actions: [
          { action: "read", title: "Read" },
          { action: "close", title: "Close" }
        ]
      }
    };

    const subscriptions = await PushSubscription.find();

    const sendNotifErrors = [];
    subscriptions.forEach(subscription => {
      webpush
        .sendNotification(subscription, JSON.stringify(notificationPayload))
        .catch(error => sendNotifErrors.push(error.message));
    });
    res.status(200).json({
      message: "Notifications sent successfully",
      errors: sendNotifErrors
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


exports.getNotifications = async (req, res, next) => {
  console.log("Get Notifications");

  try {
   const notifications = await Notification.find().sort({createdAt:-1});

    res.status(200).json({
      message: "Notifications listed successfully",
      notifications: notifications
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
