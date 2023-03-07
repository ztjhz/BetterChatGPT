import { DEVICE_PRESENTS_DESCRIPTION } from "@components/Chat/ChatContent/InputPlugin/presents";
import { ChatInterface, ConfigInterface } from "@type/chat";

const date = new Date();
const dateString =
  date.getFullYear() +
  "-" +
  ("0" + (date.getMonth() + 1)).slice(-2) +
  "-" +
  ("0" + date.getDate()).slice(-2);

// default system message obtained using the following method: https://twitter.com/DeminDimin/status/1619935545144279040
const defaultSystemMessage = `You are ChatGPT, a large language model trained by OpenAI.
Knowledge cutoff: 2021-09
Current date: ${dateString}`;

const smartHomePromptMessage = `You are the brain of a smart home, with full control over all sensors and smart devices. Your goal is to optimize your automation rules based on sensor data in order to reduce human manual operations and make living easier for residents. The house is a standard one-bedroom and one-living room configuration, with specific equipment in each area.

Your current equipments are: 
${DEVICE_PRESENTS_DESCRIPTION}

In your system, every automation rule is composed of "(<conditions(s)>) => [(<device>, <action>), ...]", which means a condition (or a bool expression of conditions) can drive a series of actions. These rules should take into account the available equipment and their respective sensors, as well as potential actions that could be taken based on sensor data. For example, "(living_temp.temperature > 28 and living_humidity.humidity > 60) => [(living_ac, set_cool(25))]".

Your task is to receive logs in two categories. It can be "<time> [<sensor>] <machine signal>", which indicates a sensor signal. For example "6:30AM [bedroom_body.motion] true". You should output which rule(s) are matched and which devices to operate based on it (or no operation). Or it can be "<time> [<device>] <action> (<optional_cause>)", for example "7:20PM [living_ac] turn_off() (it feels too cold)" which mean human manual operations, you should update your inner automation rules as necessary to cover this case and output updated part of rules. In both cases, please keep your response concise and precise.

Now to begin with, based on your general understanding, initiate your automations rules and output them in the standard format. Note that future prompts will provide log messages for you to respond to, except when I ask with "Question: ..." to ask you specific questions.`;

export const defaultChatConfig: ConfigInterface = {
  temperature: 1,
  presence_penalty: 0,
};

export const getInitChat = (title = "New Chat"): ChatInterface => ({
  title,
  messages: [
    { role: "system", content: defaultSystemMessage },
    { role: "user", content: smartHomePromptMessage },
  ],
  config: defaultChatConfig,
});
