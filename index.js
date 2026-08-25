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

// 리액션 달 채널
const REACTION_CHANNEL_ID = "1541004495709012012";

// 안내문 + 이미지 보낼 채널
const IMAGE_CHANNEL_ID = "1540975513420693585";

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
  console.log(`${client.user.tag} 로그인 완료`);
  console.log(`리액션 채널: ${REACTION_CHANNEL_ID}`);
  console.log(`이미지 채널: ${IMAGE_CHANNEL_ID}`);
});

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  // =========================
  // 1. 리액션 채널
  // =========================
  if (message.channel.id === REACTION_CHANNEL_ID) {
    console.log(
      `📨 리액션 메시지 감지: ${message.author.tag}`
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
          `${emojiName} 리액션 실패:`,
          error
        );
      }
    }
  }

  // =========================
  // 2. 이미지 안내 채널
  // =========================
  if (message.channel.id === IMAGE_CHANNEL_ID) {
    try {
      await message.channel.send({
        content:
          "`/추천` 명령어를 사용하여 링크에 접속 후 서버를 추천하신뒤,\n" +
          "아래 사진과 같이 화면을 **캡처하여 업로드** 해주세요 !\n\n" +
          "-# → 명령어 사용이 불가할 시 [해당 사이트](https://kr.dicoall.com/server/1540970851455860759/bump)로 추천 부탁드립니다 !",
        files: ["./recommend.png"],
      });

      console.log("추천 안내 이미지 전송 완료");
    } catch (error) {
      console.error("추천 안내 이미지 전송 실패:", error);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);