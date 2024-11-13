import { App } from "@slack/bolt";
import { getTrainData } from "./getTrainData";
import dotenv from "dotenv";

dotenv.config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
});

app.message(async ({ message, context, client }) => {
    if (message.channel_type === "im") {
        try {
            if (message.text && message.text.includes(`<@${context.botUserId}>`)) {
                await client.chat.postMessage({
                    channel: message.channel,
                    text: "Choose train direction:",
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: "Choose a direction you want to go.",
                            },
                        },
                        {
                            type: "actions",
                            elements: [
                                {
                                    type: "button",
                                    text: {
                                        type: "plain_text",
                                        text: "Stuttgart",
                                    },
                                    action_id: "stuttgart_button",
                                    value: "stuttgart",
                                },
                                {
                                    type: "button",
                                    text: {
                                        type: "plain_text",
                                        text: "Bietigheim",
                                    },
                                    action_id: "bietigheim_button",
                                    value: "bietigheim",
                                },
                            ],
                        },
                    ],
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
});

app.action("stuttgart_button", async ({ ack, body, client }) => {
    await ack();
    const trainData = await getTrainData("stuttgart");

    await client.chat.delete({
        channel: body.channel.id,
        ts: body.message.ts,
    });

    await client.chat.postMessage({
        channel: body.user.id,
        text: trainData,
    });
});

app.action("bietigheim_button", async ({ ack, body, client }) => {
    await ack();
    const trainData = await getTrainData("bietigheim");

    await client.chat.delete({
        channel: body.channel.id,
        ts: body.message.ts,
    });

    await client.chat.postMessage({
        channel: body.user.id,
        text: trainData,
    });
});

(async () => {
    await app.start();
    console.log("⚡️ IWantToGoHome app is running!");
})();
