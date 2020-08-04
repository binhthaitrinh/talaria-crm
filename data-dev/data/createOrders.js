const fs = require('fs');

const types = ['toys', 'electronics', 'cosmetics', 'accessories', 'others'];

const orderWebsites = [
  'amazon',
  'ebay',
  'sephora',
  'costco',
  'walgreen',
  'jomashop',
];

const status = [
  'not-yet-ordered',
  'ordered',
  'on-the-way-to-warehouse',
  'on-the-way-to-viet-nam',
  'arrived-at-viet-nam',
  'done',
  'returning',
  'returned',
];

// const items = [
//   {
//     _id: '5ecebf98457ced5854d371c9',
//     link:
//       'https://www.amazon.com/Method-Simply-Nourish-Fluid-Ounce/dp/B07J6N116K/ref=sr_1_17?dchild=1&fpw=pantry&keywords=method+shower+gel&qid=1590392620&s=pantry&sr=8-17',
//     name: 'Dầu tắm Method màu ghi Nourish',
//     status: status[3],
//     pricePerItem: 6.98,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limotslntrsoun&orderId=114-0279382-1972269&vt=YOUR_ORDERS',
//     estimatedWeight: 0.3,
//     actualWeight: 0.4,
//     quantity: 4,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//
//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,
//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371ca',
//     link:
//       'https://www.amazon.com/Method-Body-Wash-Pure-Peace/dp/B07J6N3JPC/ref=sr_1_3?crid=2B3O01I0UD1K0&dchild=1&fpw=pantry&keywords=method+body+wash+wind+down&qid=1590394416&s=pantry&sprefix=method+body+wash+wind+d%2Cpantry%2C397&sr=8-3&srs=7301146011',
//     name: 'Dầu tắm Method Hồng',
//     status: status[3],
//     pricePerItem: 6.99,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limotslntrsoun&orderId=114-0279382-1972269&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.4,
//     quantity: 5,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//
//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371cb',
//     link:
//       'https://www.amazon.com/Natrol-Biotin-Tablets-000mcg-Count/dp/B001E0WDV4/ref=sr_1_13?dchild=1&keywords=biotin+natrol&qid=1590395147&sr=8-13',
//     name: 'Natrol Biotin Beauty Tablets',
//     status: status[3],
//     pricePerItem: 15.98,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limotslntrsnwn&orderId=114-7937717-8248207&shipmentId=DtQ805s96&vt=YOUR_ORDERS',
//     estimatedWeight: 0.2,
//     actualWeight: 0.2,
//     quantity: 2,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: 'Loại 100 viên, pack 2 lọ',
//   },
//   {
//     _id: '5ecebf98457ced5854d371cc',
//     link:
//       'https://www.amazon.com/300-Things-Hope-Iain-Thomas/dp/1771680466/ref=tmm_pap_swatch_0?_encoding=UTF8&qid=1590337465&sr=8-1&fbclid=IwAR0hZFniEEc1hVIWzl-43hYnlnw6VkdxmWouRFow8REJ7O_P4HLHYCyOcKo',
//     name: '300 Things I Hope Paperback – October 1, 2016',
//     status: status[3],
//     pricePerItem: 10.29,
//     tax: 8.75,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjmqinoiktsn&orderId=114-1663544-6652258&packageIndex=0&shipmentId=DqDBx2gZT&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 2,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371cd',
//     link:
//       'https://www.amazon.com/dp/B01NA7KNTS/ref=twister_B01EY97QUE?_encoding=UTF8&th=2',
//     name: 'Lược màu tím',
//     status: status[3],
//     pricePerItem: 11.9,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=lilplunrpomrsn&orderId=114-5113255-7113866&shipmentId=DW6XG2ng6&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 10,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371ce',
//     link:
//       'https://www.amazon.com/OrthoVibration-Aligner-Vibration-Invisalign-SmileDirectClub/dp/B07SVGPYLV/ref=mp_s_a_1_1?dchild=1&keywords=orthovibration&qid=1590204903&sr=8-1&th=1&psc=1',
//     name: 'Orthorvibration',
//     status: status[3],
//     pricePerItem: 39.98,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://smile.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=lilmoxjqljlpon&orderId=111-8912910-4566665&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 1,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: 'màu hồng',
//   },
//   {
//     _id: '5ecebf98457ced5854d371cf',
//     link:
//       'https://www.amazon.com/gp/product/B07V6FKHMX/ref=ox_sc_act_title_7?smid=A3FLQQUX2A0008&psc=1&fbclid=IwAR3Jsug3-NR41d0OD4ALl6kEs6k1_EfMOrlM9H4H5bU-zajJdukeZLRyjKs',
//     name: 'Candle lighter',
//     status: status[3],
//     pricePerItem: 21.99,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjmqinoiktsn&orderId=114-1663544-6652258&packageIndex=0&shipmentId=DqDBx2gZT&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 2,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371d0',
//     link:
//       'https://www.amazon.com/Free-Swimming-Baby-Inflatable-Accessories/dp/B072N2J366/ref=mp_s_a_1_1_sspa?dchild=1&keywords=free%2Bswimming%2Bbaby&qid=1590410379&sprefix=free%2Bswim&sr=8-1-spons&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUE5VkdPWTVFR0ZMT1ImZW5jcnlwdGVkSWQ9QTAwMTk3NTAxMjEyUEhMUUNHMk5UJmVuY3J5cHRlZEFkSWQ9QTAyMjI5NDIyMDVWRjNDTldURkVQJndpZGdldE5hbWU9c3BfcGhvbmVfc2VhcmNoX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU%3D&fbclid=IwAR2mLdUPlnxDh94PxaLjLF5wnzfsZQCaK2JOZu1aoZX2E2zVcdTWt3nFuAs&th=1',
//     name: 'Free Swimming Baby Inflatable',
//     status: status[3],
//     pricePerItem: 18.7,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjmqinoiktsn&orderId=114-1663544-6652258&packageIndex=0&shipmentId=DqDBx2gZT&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 1,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371d1',
//     link:
//       'https://www.amazon.com/Eternus-Optimized-Supplement-Niacinamide-Resveratrol/dp/B0855D2Z9S/ref=sr_1_4?dchild=1&keywords=ETERNUS%20SUPPORTS%20CELL%20ENERGY%20FOR%20BETTER%20AGING&qid=1590375759&s=hpc&sr=1-4&fbclid=IwAR3qvN6TTk6N_XnQMq9VTeXbgDnJtjmF4LiFEcQkiOCt2s20aT1Escmdsi8',
//     name: 'Cell Energy for Optimized Aging & Long-Term Health',
//     status: status[3],
//     pricePerItem: 82,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjsojrrnqvon&orderId=111-0140150-6031409&packageIndex=0&shipmentId=Dq1Xr6dJ6&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 2,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371d2',
//     link:
//       'hhttps://www.amazon.com/break-your-glass-slippers-fairy/dp/1524851892/ref=sr_1_1?dchild=1&keywords=poem%20glass&qid=1590338053&sr=8-1&fbclid=IwAR00wvgYZv4iewt1SRCmR-wEkNvDkyBwT-Ejl4Z7Mhnf7mgepUuk99IZ2XU',
//     name:
//       'break your glass slippers (you are your own fairy tale) Paperback – March 17, 2020',
//     status: status[3],
//     pricePerItem: 11.99,
//     tax: 8.75,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjmqinoiktsn&orderId=114-1663544-6652258&packageIndex=0&shipmentId=DqDBx2gZT&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 2,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371d3',
//     link:
//       'https://www.amazon.com/MegaRed-Concentration-Omega-3-Familysize-softgels/dp/B075VH27J8/ref=sr_1_14?dchild=1&keywords=omega%203%20krill%20oil&qid=1587990075&sr=8-14&fbclid=IwAR3_4nimn1uZALBphfeaMDgBh8D1PhlmQQA-oDq7Xb_phwofKe7WK1VesBQ',
//     name: 'MegaRed 750mg Ultra Concentration',
//     status: status[3],
//     pricePerItem: 31.99,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjmqinoiktsn&orderId=114-1663544-6652258&packageIndex=0&shipmentId=DqDBx2gZT&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 1,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371d4',
//     link:
//       'https://www.amazon.com/gp/product/B01BEDOQHO/ref=ox_sc_act_title_5?smid=A2SFKRF5TPZMT5&psc=1&fbclid=IwAR1pGsFBqiibcVY-57RUPLGlagmlv8evvDhLnlC8_YZ1KCfo3_szRBF7Gm8',
//     name: 'Spigen Ultra Hybrid màu đen',
//     status: status[3],
//     pricePerItem: 18.99,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjmqinoiktsn&orderId=114-1663544-6652258&packageIndex=0&shipmentId=DqDBx2gZT&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 1,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//     orderAccount: '5ecef412c697ac79087b4cfb',

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371d5',
//     link:
//       'https://www.amazon.com/Waterpik-Flosser-Electric-Countertop-Irrigator/dp/B00HFQQ0VU?th=1&psc=1',
//     name: 'Máy tăm nước Aquarius GIÁ 69.99',
//     status: status[3],
//     pricePerItem: 69.99,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjmqinoiktsn&orderId=114-1663544-6652258&packageIndex=0&shipmentId=DqDBx2gZT&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 2,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//     orderAccount: '5ecef412c697ac79087b4cfb',

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: 'màu trắng',
//   },
//   {
//     _id: '5ecebf98457ced5854d371d6',
//     link:
//       'https://www.amazon.com/gp/product/B00J2HA3E0/ref=ox_sc_act_title_6?smid=A2FR88X88MFSW2&psc=1&fbclid=IwAR3McsdioEC2xGA-ASFXvfwLNePcfTryeev_AvcS4EcY1oNZn5EA03gf-a8',
//     name: 'Secret PUZZLE BOX',
//     status: status[3],
//     pricePerItem: 39.99,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjmqinoiktsn&orderId=114-1663544-6652258&packageIndex=0&shipmentId=DqDBx2gZT&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 1,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//     orderAccount: '5ecef412c697ac79087b4cfb',

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371d7',
//     link:
//       'https://www.amazon.com/Cooluli-Infinity-White-Liter-Fridge/dp/B07Y8T5GK3?th=1&psc=1&fbclid=IwAR1DsqiLwrriv0Vgk5mMt-P5QlxzNfwSfrWOuqdKx5zk0fg6wGQ6bJ0eeTw',
//     name: 'Tủ lạnh mini Cooluli',
//     status: status[3],
//     pricePerItem: 99.99,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjmqinoiktsn&orderId=114-1663544-6652258&packageIndex=0&shipmentId=DqDBx2gZT&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 1,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//     orderAccount: '5ecef412c697ac79087b4cfb',

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: 'Màu trắng, 15l',
//   },
//   {
//     _id: '5ecebf98457ced5854d371d8',
//     link:
//       'https://www.amazon.com/stores/tomtoc/page/45E73E8E-E8F4-4BC0-8039-096D89A3C963?ref_=ast_bln&fbclid=IwAR3wRK2hlweyyApdRNqb3-pMH_3uyOPbPMUHKVCdNTghLVJS-OS6eHF73Wc',
//     name: 'tomtoc 360 Protective Laptop',
//     status: status[3],
//     pricePerItem: 23.99,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjmqinoiktsn&orderId=114-1663544-6652258&packageIndex=0&shipmentId=DqDBx2gZT&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 1,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//     orderAccount: '5ecef412c697ac79087b4cfb',

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371d9',
//     link:
//       'https://www.amazon.com/Vitamix-A3500-Professional-Grade-Low-Profile-Container/dp/B075713NNL/ref=sr_1_1_sspa?dchild=1&keywords=vitamix%203500&qid=1588903833&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzNFQ4WlpMODE0UVRNJmVuY3J5cHRlZElkPUEwNzkzODYzRzdJTTVDSDFZVFA5JmVuY3J5cHRlZEFkSWQ9QTA0MTg2MzBIQjc3MzhFVjROWlAmd2lkZ2V0TmFtZT1zcF9hdGYmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl&fbclid=IwAR0E1h6NKBuo70_E5scps518DHkAy7eQYnhEZ6vapZw3evkkWVBIJjvSOaQ',
//     name: 'Máy xay sinh tố',
//     status: status[3],
//     pricePerItem: 549.95,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://smile.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=lijgpwnppinsqn&orderId=114-2337196-0853808&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 1,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//     orderAccount: '5ecef412c697ac79087b4cfb',

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371da',
//     link:
//       'https://www.amazon.com/Anatomy-Stretching-Second-Illustrated-Rehabilitation/dp/1583943714/ref=tmm_pap_swatch_0?_encoding=UTF8&qid=1588262723&sr=1-1',
//     name: 'The anatomy of stretching',
//     status: status[3],
//     pricePerItem: 17.49,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjmqinoiktsn&orderId=114-1663544-6652258&packageIndex=0&shipmentId=DqDBx2gZT&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 1,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//     orderAccount: '5ecef412c697ac79087b4cfb',

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371db',
//     link:
//       'https://www.amazon.com/gp/product/1878424319/ref=crt_ewc_img_dp_1?ie=UTF8&psc=1&smid=ATVPDKIKX0DER&fbclid=IwAR2nrbtHRsxDaz98-j5gK46VrCzVL9Kvh3zYoDEB63Em8RyV9FZQv0kOgU4',
//     name: 'The 4 agreements',
//     status: status[3],
//     pricePerItem: 6.48,
//     tax: 0.0,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjmqinoiktsn&orderId=114-1663544-6652258&packageIndex=0&shipmentId=DqDBx2gZT&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 1,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//     orderAccount: '5ecef412c697ac79087b4cfb',

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
//   {
//     _id: '5ecebf98457ced5854d371dc',
//     link:
//       'https://www.amazon.com/Wrote-This-You-Just-Words/dp/1771680040/ref=tmm_pap_swatch_0?_encoding=UTF8&qid=&sr=&fbclid=IwAR3djBkgCmSFQbwnXrO1rxTxfHX53S4UHcjaK0n7sbZkxyUYKgp47-Ca5Qc',
//     name: ' Wrote This For You: Just the Words',
//     status: status[3],
//     pricePerItem: 9.95,
//     tax: 8.75,
//     usShippingFee: 0.0,
//     trackingLink:
//       'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=limjmqinoiktsn&orderId=114-1663544-6652258&packageIndex=0&shipmentId=DqDBx2gZT&vt=YOUR_ORDERS',
//     estimatedWeight: 0.5,
//     actualWeight: 0.8,
//     quantity: 3,
//     orderedWebsite: orderWebsites[0],
//     invoiceLink: '',
//     orderAccount: '5ecef412c697ac79087b4cfb',

//     shippingToVNFee: 10.0,

//     orderedDate: new Date('May 26, 2020 03:24:00'),
//     arrivedAtWarehouseDate: null,
//     shippingToVnDate: null,
//     arrivedAtVnDate: null,

//     returnPkgArvlDate: null,
//     type: types[6],
//     notes: '',
//   },
// ];

const items = [
  {
    link:
      'https://www.amazon.com/dp/B01NA7KNTS/ref=twister_B01EY97QUE?_encoding=UTF8&th=2',
    name: 'Lược màu tím',
    status: 'on-the-way-to-viet-nam',
    trackingLink:
      'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=lilplunrpomrsn&orderId=114-5113255-7113866&shipmentId=DW6XG2ng6&vt=YOUR_ORDERS',
    pricePerItem: 10.99,
    usShippingFee: 0,
    quantity: 1,
    estimatedWeight: 0.34,
    actualWeight: 0.4,
    orderedWebsite: 'amazon',

    type: 'others',
    notes: '',
  },
  {
    link:
      'https://www.amazon.com/dp/B01NA7KNTS/ref=twister_B01EY97QUE?_encoding=UTF8&th=2',
    name: 'Lược màu tím',
    status: 'on-the-way-to-viet-nam',
    trackingLink:
      'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=lilplunrpomrsn&orderId=114-5113255-7113866&shipmentId=DW6XG2ng6&vt=YOUR_ORDERS',
    pricePerItem: 14.99,
    usShippingFee: 0,
    quantity: 1,
    estimatedWeight: 0.02,
    actualWeight: 0.02,
    orderedWebsite: 'amazon',

    type: 'others',
    notes: '',
  },
  {
    link:
      'https://www.amazon.com/dp/B01NA7KNTS/ref=twister_B01EY97QUE?_encoding=UTF8&th=2',
    name: 'Lược màu tím',
    status: 'on-the-way-to-viet-nam',
    trackingLink:
      'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=lilplunrpomrsn&orderId=114-5113255-7113866&shipmentId=DW6XG2ng6&vt=YOUR_ORDERS',
    pricePerItem: 21,
    usShippingFee: 0,
    quantity: 1,
    estimatedWeight: 0.03,
    actualWeight: 0.1,
    orderedWebsite: 'amazon',

    type: 'others',
    notes: '',
  },
  {
    link:
      'https://www.amazon.com/dp/B01NA7KNTS/ref=twister_B01EY97QUE?_encoding=UTF8&th=2',
    name: 'Lược màu tím',
    status: 'on-the-way-to-viet-nam',
    trackingLink:
      'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=lilplunrpomrsn&orderId=114-5113255-7113866&shipmentId=DW6XG2ng6&vt=YOUR_ORDERS',
    pricePerItem: 18,
    usShippingFee: 0,
    quantity: 1,
    estimatedWeight: 0.2,
    actualWeight: 0.4,
    orderedWebsite: 'amazon',

    type: 'others',
    notes: '',
  },
  {
    link:
      'https://www.amazon.com/dp/B01NA7KNTS/ref=twister_B01EY97QUE?_encoding=UTF8&th=2',
    name: 'Lược màu tím',
    status: 'on-the-way-to-viet-nam',
    trackingLink:
      'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=lilplunrpomrsn&orderId=114-5113255-7113866&shipmentId=DW6XG2ng6&vt=YOUR_ORDERS',
    pricePerItem: 68.42,
    usShippingFee: 10,
    tax: 0.0875,
    quantity: 2,
    estimatedWeight: 14.4,
    actualWeight: 14.4,
    orderedWebsite: 'amazon',

    type: 'others',
    notes: '',
  },
  {
    link:
      'https://www.amazon.com/dp/B01NA7KNTS/ref=twister_B01EY97QUE?_encoding=UTF8&th=2',
    name: 'Lược màu tím',
    status: 'on-the-way-to-viet-nam',
    trackingLink:
      'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=lilplunrpomrsn&orderId=114-5113255-7113866&shipmentId=DW6XG2ng6&vt=YOUR_ORDERS',
    pricePerItem: 19.18,
    usShippingFee: 5,
    quantity: 3,
    estimatedWeight: 0.5,
    actualWeight: 0.4,
    orderedWebsite: 'amazon',

    type: 'others',
    notes: '',
  },
  {
    link:
      'https://www.amazon.com/dp/B01NA7KNTS/ref=twister_B01EY97QUE?_encoding=UTF8&th=2',
    name: 'Lược màu tím',
    status: 'on-the-way-to-viet-nam',
    trackingLink:
      'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=lilplunrpomrsn&orderId=114-5113255-7113866&shipmentId=DW6XG2ng6&vt=YOUR_ORDERS',
    pricePerItem: 499,
    usShippingFee: 0,
    quantity: 1,
    estimatedWeight: 1.5,
    actualWeight: 1.5,
    orderedWebsite: 'amazon',

    type: 'others',
    notes: '',
  },
  {
    link:
      'https://www.amazon.com/dp/B01NA7KNTS/ref=twister_B01EY97QUE?_encoding=UTF8&th=2',
    name: 'Lược màu tím',
    status: 'on-the-way-to-viet-nam',
    trackingLink:
      'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=lilplunrpomrsn&orderId=114-5113255-7113866&shipmentId=DW6XG2ng6&vt=YOUR_ORDERS',
    pricePerItem: 14.99,
    usShippingFee: 0,
    quantity: 1,
    estimatedWeight: 0.02,
    actualWeight: 0.03,
    orderedWebsite: 'amazon',

    type: 'others',
    notes: '',
  },
  {
    link:
      'https://www.amazon.com/dp/B01NA7KNTS/ref=twister_B01EY97QUE?_encoding=UTF8&th=2',
    name: 'Lược màu tím',
    status: 'on-the-way-to-viet-nam',
    trackingLink:
      'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=lilplunrpomrsn&orderId=114-5113255-7113866&shipmentId=DW6XG2ng6&vt=YOUR_ORDERS',
    pricePerItem: 31.72,
    usShippingFee: 0,
    quantity: 1,
    estimatedWeight: 1.5,
    actualWeight: 1.5,
    orderedWebsite: 'amazon',

    type: 'others',
    notes: '',
  },
  {
    link:
      'https://www.amazon.com/dp/B01NA7KNTS/ref=twister_B01EY97QUE?_encoding=UTF8&th=2',
    name: 'Lược màu tím',
    status: 'on-the-way-to-viet-nam',
    trackingLink:
      'https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=lilplunrpomrsn&orderId=114-5113255-7113866&shipmentId=DW6XG2ng6&vt=YOUR_ORDERS',
    pricePerItem: 18.99,
    usShippingFee: 0,
    quantity: 1,
    estimatedWeight: 0.2,
    actualWeight: 0.4,
    orderedWebsite: 'amazon',

    type: 'others',
    notes: '',
  },
];

console.log(items.length);

try {
  fs.writeFileSync(`${__dirname}/order.json`, JSON.stringify(items));
  console.log('Data writen to file...');
} catch (err) {
  console.log(err);
}
