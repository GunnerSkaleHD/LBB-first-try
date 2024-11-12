import { App } from "@slack/bolt";
import { getTrainData } from "./getTrainData";
import "dotenv/config";

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
});

// app.event("app_mention", async ({ event, context, client }) => {
//     console.log("It worked");
//     try {
//         // Send the ephemeral message with train data
//         await client.chat.postEphemeral({
//             channel: event.channel,
//             user: event.user,
//             text: await getTrainData(),
//         });
//     } catch (error) {
//         console.error(error);
//     }
// });

app.message(async ({ message, event, context, say, client }) => {
    if (message.channel_type === "im") {
        try {
            if (message.text && message.text.includes(`<@${context.botUserId}>`)) {
                await client.chat.postMessage({
                    channel: message.channel,
                    text: await getTrainData(),
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
});

(async () => {
    await app.start();

    console.log("⚡️ IWantToGoHome app is running!");
})();
