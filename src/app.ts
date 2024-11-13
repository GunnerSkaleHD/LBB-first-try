import { App, BlockAction, ButtonAction, Middleware, SlackActionMiddlewareArgs } from "@slack/bolt";
import { getTrainData } from "./getTrainData";
import dotenv from "dotenv";

dotenv.config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
});

// Type guard to check message type and ensure it has text
const isMessageWithText = (message: any): message is { type: "message"; text: string; channel: string } => {
    return message.type === "message" && typeof message.text === "string";
};

app.message(async ({ message, context, client }) => {
    if ("channel_type" in message && message.channel_type === "im") {
        try {
            if (isMessageWithText(message) && message.text.includes(`<@${context.botUserId}>`)) {
                await client.chat.postMessage({
                    channel: message.channel,
                    text: "Choose train direction:",
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: "Choose a S-Bahn direction",
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
                                {
                                    type: "button",
                                    text: {
                                        type: "plain_text",
                                        text: "Marbach",
                                    },
                                    action_id: "marbach_button",
                                    value: "marbach",
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

// Define a function to handle button actions
function handleAction(direction: string): Middleware<SlackActionMiddlewareArgs<BlockAction<ButtonAction>>> {
    return async ({ ack, body, client }) => {
        await ack();
        const actionBody = body as { user: { id: string }; channel: { id: string }; message: { ts: string | undefined } };
        const trainData = await getTrainData(direction);

        if (actionBody.channel.id && actionBody.message.ts) {
            await client.chat.delete({
                channel: actionBody.channel.id,
                ts: actionBody.message.ts,
            });

            await client.chat.postMessage({
                channel: actionBody.user.id,
                text: trainData,
            });
        }
    };
}

// Register action handlers
app.action("stuttgart_button", handleAction("stuttgart"));
app.action("bietigheim_button", handleAction("bietigheim"));
app.action("marbach_button", handleAction("marbach"));

(async () => {
    await app.start();
    console.log("⚡️ IWantToGoHome app is running!");
})();
