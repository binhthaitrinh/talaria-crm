const fs = require('fs');

const giftcards = [
  {
    giftCardType: 'amazon',
    account: '5ecef412c697ac79087b4cfb',
    priceInBtc: 0.01288026,
    btcUsdRate: 10224.3,
    usdVndRate: 23286,
    giftCardValue: 200,
  },
  {
    giftCardType: 'amazon',
    account: '5ecef412c697ac79087b4cfb',
    priceInBtc: 0.03179557,
    btcUsdRate: 10163.72,
    usdVndRate: 23286,
    giftCardValue: 500,
  },
  {
    giftCardType: 'amazon',
    account: '5ecef412c697ac79087b4cfb',
    priceInBtc: 0.03822025,
    btcUsdRate: 9073,
    usdVndRate: 23310,
    giftCardValue: 500,
  },
  {
    giftCardType: 'amazon',
    account: '5ecef412c697ac79087b4cfb',
    priceInBtc: 0.06035217,
    btcUsdRate: 5895,
    usdVndRate: 23205.5,
    giftCardValue: 450,
  },
  {
    giftCardType: 'amazon',
    account: '5ecef412c697ac79087b4cfb',
    priceInBtc: 0.04641182,
    btcUsdRate: 7509.16,
    usdVndRate: 23500,
    giftCardValue: 500,
  },
  {
    giftCardType: 'amazon',
    account: '5ecef412c697ac79087b4cfb',
    priceInBtc: 0.04829563,
    btcUsdRate: 7519.21,
    usdVndRate: 23500,
    giftCardValue: 500,
  },
  {
    giftCardType: 'amazon',
    account: '5ecef412c697ac79087b4cfb',
    priceInBtc: 0.04863814,
    btcUsdRate: 7550.76,
    usdVndRate: 23600,
    giftCardValue: 500,
  },
  {
    giftCardType: 'amazon',
    account: '5ecef412c697ac79087b4cfb',
    priceInBtc: 0.05271416,
    btcUsdRate: 7600.47,
    usdVndRate: 23500,
    giftCardValue: 550,
  },
  {
    giftCardType: 'amazon',
    account: '5ecef412c697ac79087b4cfb',
    priceInBtc: 0.04719327,
    btcUsdRate: 7712.85,
    usdVndRate: 23500,
    giftCardValue: 500,
  },
  {
    giftCardType: 'amazon',
    account: '5ecef412c697ac79087b4cfb',
    priceInBtc: 0.05047056,
    btcUsdRate: 8643.95,
    usdVndRate: 23600,
    giftCardValue: 600,
  },
];

let i = 4;
giftcards.forEach((gc) => {
  const date = new Date(2020, 4, i, 13, 0, 0);
  gc.date = date;
  i++;
});

try {
  fs.writeFileSync(`${__dirname}/giftcard.json`, JSON.stringify(giftcards));
  console.log('Data writen to file...');
} catch (err) {
  console.log(err);
}
