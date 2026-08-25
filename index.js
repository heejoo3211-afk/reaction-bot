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

// 자동 반응할 채널
const CHANNEL_ID = "1541004495709012012";

// 06 제외
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
  console.log(`자동 리액션 채널: ${CHANNEL_ID}`);
});

client.on("messageCreate", async (message) => {
  // 서버 메시지만
  if (!message.guild) return;

  // 봇이 보낸 메시지는 무시
  if (message.author.bot) return;

  // 지정된 채널에서만 작동
  if (message.channel.id !== CHANNEL_ID) return;

  console.log(
    `📨 메시지 감지: ${message.author.tag} / ${message.content}`
  );

  // =========================
  // 1. 자동 이모지 리액션
  // =========================

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

      // 0.5초 간격
      await sleep(500);
    } catch (error) {
      console.error(
        `${emojiName} 리액션 실패:`,
        error
      );
    }
  }

  // =========================
  // 2. 안내 문구 + 이미지 전송
  // =========================

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
});

client.login(process.env.DISCORD_TOKEN);