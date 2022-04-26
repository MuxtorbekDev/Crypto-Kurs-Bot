const Telegraf = require("telegraf").Telegraf;
const bot = new Telegraf(`5361540061:AAHEUsgMZv9o-tOqadmK4_VeJRgzH0HEGF4`);
const axios = require("axios");

const apiKey =
  "0c106a53febc2c0a46160a9ded01a2d42803a4a3e14d32cd6750aa2ee581a53d";

bot.command(["start", "help"], (msg) => {
  sendStartMessage(msg);
});

bot.action("start", (msg) => {
  msg.deleteMessage();
  sendStartMessage(msg);
});

function sendStartMessage(msg) {
  let startMessage = "<b>Salom crypto valyuta kurslari bilan  tanishing!</b>";
  bot.telegram.sendMessage(msg.chat.id, startMessage, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Valyuta Kurslar", callback_data: "price" }],
        [{ text: "Biz Haqimizda", callback_data: "info" }],
        [{ text: "Crypto market", url: "https://www.cryptocompare.com/" }],
      ],
    },
    parse_mode: "HTML",
  });
}

bot.action("price", (msg) => {
  msg.deleteMessage();
  let priceMessage = "<b>Qaysi valyuta kurs bilan tanishmoqchisiz?</b>";
  bot.telegram.sendMessage(msg.chat.id, priceMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "BTC", callback_data: "price-BTC" },
          { text: "ETH", callback_data: "price-ETH" },
        ],
        [
          { text: "BCH", callback_data: "price-BCH" },
          { text: "BSV", callback_data: "price-BSV" },
        ],
        [{ text: "Menuga Qaytish", callback_data: "start" }],
      ],
    },
    parse_mode: "HTML",
  });
});

let priceActionList = ["price-BTC", "price-ETH", "price-BCH", "price-BSV"];
bot.action(priceActionList, (msg) => {
  msg.deleteMessage();
  getPrice(msg);
});

const getPrice = async (msg) => {
  let match = msg.match[0];
  let price = match.split("-")[1];

  try {
    let res = await axios.get(
      `https://min-api.cryptocompare.com/data/price?fsym=${price}&tsyms=UZS&api_key=${apiKey}`
    );

    let priceMessage = `<b>${price} valyuta kursi:</b>\n 1 ${price} - ${res.data.UZS} so'm`;

    bot.telegram.sendMessage(msg.chat.id, priceMessage, {
      reply_markup: {
        inline_keyboard: [[{ text: "Orqaga Qaytish", callback_data: "price" }]],
      },
      parse_mode: "HTML",
    });
  } catch (e) {
    console.log(e);
  }
};

bot.action("info", (msg) => {
  msg.answerCbQuery();
  bot.telegram.sendMessage(msg.chat.id, "Biz haqimizda...", {
    reply_markup: {
      keyboard: [
        [{ text: "Kreditlar" }, { text: "API" }],
        [{ text: "Keyboardlarni o'chirish" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

bot.hears("Kreditlar", (msg) => {
  msg.reply("Kreditlar");
});

bot.hears("API", (msg) => {
  msg.reply("Api: https://www.cryptocompare.com/api/");
});

bot.hears("Keyboardlarni o'chirish", (msg) => {
  bot.telegram.sendMessage(msg.chat.id, "Keyboard o'chirildi!", {
    reply_markup: {
      remove_keyboard: true,
    },
  });
});

bot.launch();
