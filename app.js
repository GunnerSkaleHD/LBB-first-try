const { App } = require("@slack/bolt");
const { getTrainData } = require("./getTrainData");
require("dotenv").config();

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, // add this
    appToken: process.env.SLACK_APP_TOKEN, // add this
});

app.event("app_mention", async ({ event, context, client, say }) => {
    try {
        await client.chat.postEphemeral({
            channel: event.channel,
            user: event.user,
            text: await getTrainData(),
        });
    } catch (error) {
        console.error(error);
    }
});
getTrainData()
    .then((result) => {})
    .catch((error) => {
        console.error(error);
    });

(async () => {
    // Start your app
    await app.start();

    console.log("⚡️ Bolt app is running!");
})();
