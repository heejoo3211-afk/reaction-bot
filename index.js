const {
  Client,
  GatewayIntentBits,
} = require("discord.js");

const path = require("path");

require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});


// ======================================================
// 채널 ID
// ======================================================

// 자동 리액션
const REACTION_CHANNEL_ID = "1541004495709012012";

// 서버 추천 안내 + 이미지
const RECOMMEND_CHANNEL_ID = "1540974453754830878";

// 뉴페이스 제거 기준
const NEWFACE_CHANNEL_ID = "1540975693700136980";

// 랭크 확인
const RANK_CHANNEL_ID = "1540975991554318437";

// 이벤트 추천
const EVENT_CHANNEL_ID = "1540975412799217695";

// 뮤지션 추천
const MUSICIAN_CHANNEL_ID = "1541025942410100816";

// 내전 요청
const CIVIL_WAR_CHANNEL_ID = "1540976276582694952";

// 후기 작성
const REVIEW_CHANNEL_ID = "1540975272868839444";


// ======================================================
// 역할 ID
// ======================================================

const EVENT_ROLE_ID = "1540971424204722296";

const CIVIL_WAR_ROLE_ID = "1540971383574626325";


// ======================================================
// 이미지
// ======================================================

const RECOMMEND_IMAGE = path.join(
  __dirname,
  "recommend.png"
);

const MUSICIAN_IMAGE = path.join(
  __dirname,
  "musician.png"
);


// ======================================================
// 자동 리액션 이모지
// ======================================================

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


// ======================================================
// 기존 봇 안내 메시지 삭제
// ======================================================

async function deleteOldBotMessages(channel) {

  try {

    // 최근 메시지 50개 확인
    const messages = await channel.messages.fetch({
      limit: 50,
    });

    // 이 봇이 보낸 메시지만 찾기
    const botMessages = messages.filter(
      (msg) => msg.author.id === client.user.id
    );

    // 기존 봇 안내 전부 삭제
    for (const [, botMessage] of botMessages) {

      try {
        await botMessage.delete();
      } catch (error) {
        console.error(
          "기존 안내 메시지 삭제 실패:",
          error
        );
      }

    }

  } catch (error) {

    console.error(
      "기존 메시지 확인 실패:",
      error
    );

  }
}


// ======================================================
// 봇 준비 완료
// ======================================================

client.once("ready", () => {

  console.log(`${client.user.tag} 로그인 완료`);

  console.log(`리액션 채널: ${REACTION_CHANNEL_ID}`);
  console.log(`추천 채널: ${RECOMMEND_CHANNEL_ID}`);
  console.log(`뉴페이스 채널: ${NEWFACE_CHANNEL_ID}`);
  console.log(`이벤트 추천 채널: ${EVENT_CHANNEL_ID}`);
  console.log(`뮤지션 추천 채널: ${MUSICIAN_CHANNEL_ID}`);
  console.log(`내전 요청 채널: ${CIVIL_WAR_CHANNEL_ID}`);
  console.log(`후기 작성 채널: ${REVIEW_CHANNEL_ID}`);

});


// ======================================================
// 메시지 감지
// ======================================================

client.on("messageCreate", async (message) => {

  // DM 제외
  if (!message.guild) return;

  // 봇 메시지 제외
  // 이 봇 자신의 메시지만 무시
if (message.author.id === client.user.id) return;


  // ====================================================
  // 1. 자동 이모지 리액션
  // ====================================================

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

          console.log(
            `이모지 없음: ${emojiName}`
          );

          continue;
        }

        await message.react(emoji);

        console.log(
          `이모지 추가: ${emojiName}`
        );

        await sleep(500);

      } catch (error) {

        console.error(
          `${emojiName} 리액션 실패:`,
          error
        );

      }

    }

    return;
  }


  // ====================================================
  // 2. 서버 추천 안내
  // ====================================================

  if (message.channel.id === RECOMMEND_CHANNEL_ID) {

    try {

      // 기존 봇 안내 삭제
      await deleteOldBotMessages(message.channel);

      // 새 안내 전송
      await message.channel.send({

        content:
          "`/추천` 명령어를 사용하여 링크에 접속 후 서버를 추천하신뒤,\n" +
          "아래 사진과 같이 화면을 **캡처하여 업로드** 해주세요 !\n\n" +
          "-# → 명령어 사용이 불가할 시 [해당 사이트](https://kr.dicoall.com/server/1540970851455860759/bump)로 추천 부탁드립니다 !",

        files: [
          RECOMMEND_IMAGE,
        ],

      });

      console.log(
        "추천 안내 재전송 완료"
      );

    } catch (error) {

      console.error(
        "추천 안내 전송 실패:",
        error
      );

    }

    return;
  }


  // ====================================================
  // 3. 뉴페이스 제거 기준
  // ====================================================

  if (message.channel.id === NEWFACE_CHANNEL_ID) {

    try {

      await deleteOldBotMessages(message.channel);

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

      console.log(
        "뉴페이스 안내 재전송 완료"
      );

    } catch (error) {

      console.error(
        "뉴페이스 안내 전송 실패:",
        error
      );

    }

    return;
  }


  // ====================================================
  // 4. 이벤트 추천
  // ====================================================

  if (message.channel.id === EVENT_CHANNEL_ID) {

    try {

      await deleteOldBotMessages(message.channel);

      await message.channel.send({

        content:
          "이 채널은 서버원 여러분께서 원하시는 이벤트를 자유롭게 제안해 주시는 채널입니다.\n\n" +

          "진행되었으면 하는 이벤트가 있다면 아래 양식에 맞춰 작성해 주세요. 작성해 주신 내용은 기획팀에서 검토 후 논의를 거쳐 추후 이벤트 진행에 참고하도록 하겠습니다.\n\n" +

          "-# 양식 예시\n\n" +

          "```" +
          "이벤트 이름 : 마냥 강화 이벤트\n\n" +

          "추천 이유 : 마냥 강화 이벤트를 홍대 서버에서 진행하면 참여하여 다른 서버원분들과 경쟁하며 흥미를 느낄 수 있을 거 같아서 이 이벤트를 열어달라고 요청드리고 싶었습니다. " +
          "```\n\n" +

          `<@&${EVENT_ROLE_ID}> 역할 멘션 필수 !`,

        allowedMentions: {
          roles: [
            EVENT_ROLE_ID,
          ],
        },

      });

      console.log(
        "이벤트 추천 안내 재전송 완료"
      );

    } catch (error) {

      console.error(
        "이벤트 추천 안내 전송 실패:",
        error
      );

    }

    return;
  }


  // ====================================================
  // 5. 뮤지션 추천
  // ====================================================

  if (message.channel.id === MUSICIAN_CHANNEL_ID) {

    try {

      await deleteOldBotMessages(message.channel);

      await message.channel.send({

        files: [
          MUSICIAN_IMAGE,
        ],

      });

      console.log(
        "뮤지션 추천 이미지 재전송 완료"
      );

    } catch (error) {

      console.error(
        "뮤지션 추천 이미지 전송 실패:",
        error
      );

    }

    return;
  }


  // ====================================================
  // 6. 내전 요청
  // ====================================================

  if (message.channel.id === CIVIL_WAR_CHANNEL_ID) {

    try {

      await deleteOldBotMessages(message.channel);

      await message.channel.send({

        content:
          "## 내전 요청 양식\n" +

          "> `게임명, 시작 날짜, 모집 인원, `\n" +

          "> `@ෆ．🧸＇ 내전 열어주세요．⌢⌢ `\n" +

          "-# 양식에 맞춰 작성 안 할시 요청이 삭제 될 수도 있다는 점 알아주세요!\n" +

          "`ex ) 구스구스덕 / 7월 20일 / 최소 7명 최대 16명`\n" +

          `<@&${CIVIL_WAR_ROLE_ID}>`,

        allowedMentions: {
          roles: [
            CIVIL_WAR_ROLE_ID,
          ],
        },

      });

      console.log(
        "내전 요청 양식 재전송 완료"
      );

    } catch (error) {

      console.error(
        "내전 요청 양식 전송 실패:",
        error
      );

    }

    return;
  }


  // ====================================================
  // 7. 후기 작성
  // ====================================================

  if (message.channel.id === REVIEW_CHANNEL_ID) {

    try {

      await deleteOldBotMessages(message.channel);

      await message.channel.send({

        content:
          "## **<a:5_Dkingdom_ayx_09:1541090599250296883> :: 후기작성 안내사항 :: <a:5_Dkingdom_ayx_09:1541090599250296883> **\n" +

          "♡ : 후기는 24시간 이내로 작성해주세요\n" +

          "♡ : 후기 미작성 시 선착 시 제외\n" +

          "♡ : 후기 작성시엔 제작물을 필수로 올려야 합니다.",

      });

      console.log(
        "후기 작성 안내 재전송 완료"
      );

    } catch (error) {

      console.error(
        "후기 작성 안내 전송 실패:",
        error
      );

    }

    return;
  }

});


// ======================================================
// 로그인
// ======================================================

client.login(process.env.DISCORD_TOKEN);