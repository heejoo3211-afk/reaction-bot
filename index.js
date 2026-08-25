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

// ========================================
// 채널 ID
// ========================================

// 자동 이모지 리액션 채널
const REACTION_CHANNEL_ID = "1541004495709012012";

// 추천 안내 + 이미지 채널
const IMAGE_CHANNEL_ID = "1540974453754830878";

// 뉴페이스 제거 기준 안내 채널
const NEWFACE_CHANNEL_ID = "1540975693700136980";

// 랭크 확인 채널
const RANK_CHANNEL_ID = "1540975991554318437";


// ========================================
// 자동 리액션 이모지
// 06 제외
// ========================================

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


// ========================================
// 봇 실행
// ========================================

client.once("ready", () => {
  console.log(`${client.user.tag} 로그인 완료`);

  console.log(`리액션 채널: ${REACTION_CHANNEL_ID}`);
  console.log(`추천 안내 채널: ${IMAGE_CHANNEL_ID}`);
  console.log(`뉴페이스 안내 채널: ${NEWFACE_CHANNEL_ID}`);
  console.log(`랭크 확인 채널: ${RANK_CHANNEL_ID}`);
});


// ========================================
// 메시지 감지
// ========================================

client.on("messageCreate", async (message) => {

  // DM 무시
  if (!message.guild) return;

  // 봇 메시지 무시
  if (message.author.bot) return;


  // ========================================
  // 1. 자동 이모지 리액션
  // ========================================

  if (message.channel.id === REACTION_CHANNEL_ID) {

    console.log(
      `리액션 메시지 감지: ${message.author.tag}`
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

        // 이모지 하나당 0.5초 간격
        await sleep(500);

      } catch (error) {

        console.error(
          `${emojiName} 리액션 실패:`,
          error
        );

      }
    }
  }


  // ========================================
  // 2. 서버 추천 안내 + 이미지
  // ========================================

  if (message.channel.id === IMAGE_CHANNEL_ID) {

    try {

      await message.channel.send({
        content:
          "`/추천` 명령어를 사용하여 링크에 접속 후 서버를 추천하신뒤,\n" +
          "아래 사진과 같이 화면을 **캡처하여 업로드** 해주세요 !\n\n" +
          "-# → 명령어 사용이 불가할 시 [해당 사이트](https://kr.dicoall.com/server/1540970851455860759/bump)로 추천 부탁드립니다 !",

        files: ["./recommend.png"],
      });

      console.log("추천 안내 + 이미지 전송 완료");

    } catch (error) {

      console.error(
        "추천 안내 이미지 전송 실패:",
        error
      );

    }
  }


  // ========================================
  // 3. 뉴페이스 제거 기준 안내
  // ========================================

  if (message.channel.id === NEWFACE_CHANNEL_ID) {

    try {

      await message.channel.send({
        content:
          "## 뉴페이스 제거 기준 ♡\n\n" +
          "```text\n" +
          "음성방 시간 : 25시간 이상\n" +
          "채팅방 횟수 : 400개 이상\n" +
          "```\n" +
          "음성, 채팅 모두 달성하셔야 제거 가능합니다!\n\n" +
          `랭크 확인은 <#${RANK_CHANNEL_ID}> 에서 사용해 주세요.`,
      });

      console.log("뉴페이스 제거 기준 안내 전송 완료");

    } catch (error) {

      console.error(
        "뉴페이스 안내 전송 실패:",
        error
      );

    }
  }
});


// ========================================
// 로그인
// ========================================

client.login(process.env.DISCORD_TOKEN);