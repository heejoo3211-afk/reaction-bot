const {
  Client,
  GatewayIntentBits,
} = require("discord.js");

require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const CHANNEL_ID = "1541004495709012012";

const EMOJI_NAMES = [
  "4_Dkingdom_a_yx_00",
  "4_Dkingdom_a_yx_01",
  "4_Dkingdom_a_yx_02",
  "4_Dkingdom_a_yx_03",
  "4_Dkingdom_a_yx_04",
  "4_Dkingdom_a_yx_05",
  "4_Dkingdom_a_yx_07",
];

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

client.once("ready", () => {
  console.log(` ${client.user.tag} 로그인 완료`);
  console.log(` 자동 리액션 채널: ${CHANNEL_ID}`);
});

client.on("messageCreate", async (message) => {
  // 서버 메시지만
  if (!message.guild) return;

  // 봇 메시지는 무시
  if (message.author.bot) return;

  // 지정된 채널만
  if (message.channel.id !== CHANNEL_ID) return;

  console.log(
    `📨 메시지 감지: ${message.author.tag} / ${message.content}`
  );

  for (const emojiName of EMOJI_NAMES) {
    try {
      const emoji = message.guild.emojis.cache.find(
        (e) => e.name === emojiName
      );

      if (!emoji) {
        console.log(`이모지 없음: ${emojiName}`);
        continue;
      }

      await message.react(emoji);

      console.log(`이모지 추가: ${emojiName}`);

      await sleep(500);
    } catch (error) {
      console.error(
        ` ${emojiName} 리액션 실패:`,
        error
      );
    }
  }
});

client.login(process.env.DISCORD_TOKEN);