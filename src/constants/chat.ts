const date = new Date();
const dateString =
  date.getFullYear() +
  '-' +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + date.getDate()).slice(-2);

// default system message obtained using the following method: https://twitter.com/DeminDimin/status/1619935545144279040
export const defaultSystemMessage = `You are ChatGPT, a large language model trained by OpenAI.
Knowledge cutoff: 2021-09
Current date: ${dateString}`;
