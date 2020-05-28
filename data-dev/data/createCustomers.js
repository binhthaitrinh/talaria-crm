const mongoose = require('mongoose');
const fs = require('fs');

const types = ['customer', 'vendor'];

const customers = [
  {
    _id: '5ecef89935966d7e5a56cfca',
    type: types[0],
    name: 'Nguyễn Bình Minh',
    address: [
      {
        fullAddress:
          'Nguyễn Bình Minh Số 15b. Ngõ 12A lý nam đế, hoàn kiếm, hà nội',
        notes: '',
      },
    ],
    phoneNumber: '366595618',
    discountRate: 0.0,
    notes: '',
  },
  {
    _id: '5ecef89935966d7e5a56cfcb',
    type: types[0],
    name: 'Phùng Tấn Sang',
    address: [
      {
        fullAddress: 'FPT Software đường D1 khu công nghệ cao tphcm',
        notes: '',
      },
    ],
    phoneNumber: '(+94)909518304',
    discountRate: 0.0,
    notes: '',
  },
  {
    _id: '5ecef89935966d7e5a56cfcc',
    type: types[0],
    name: 'Vũ Ngọc Châu',
    address: [
      {
        fullAddress: '58 đường số 2, làng báo chí, thảo điền, Q2, Hồ chí minh',
        notes: '',
      },
    ],
    phoneNumber: '(+)84943492783',
    discountRate: 0.0,
    notes: '',
  },
  {
    _id: '5ecef89935966d7e5a56cfcd',
    type: types[0],
    name: 'Lê Bảo Quang',
    address: [
      {
        fullAddress: 'Số 42 ngõ 178 Thái Hà',
        notes: '',
      },
    ],
    phoneNumber: '(+84)901100494',
    discountRate: 0.0,
    notes: '',
  },
  {
    _id: '5ecef89935966d7e5a56cfce',
    type: types[0],
    name: 'Nguyễn Ngọc Linh',
    address: [
      {
        fullAddress: '23 Hàng chiếu, Hoàn kiếm, Hà Nội',
        notes: '',
      },
    ],
    phoneNumber: '0987654321',
    discountRate: 0.0,
    notes: '',
  },
];

try {
  fs.writeFileSync(`${__dirname}/customers.json`, JSON.stringify(customers));
  console.log('Data writen to file...');
} catch (err) {
  console.log(err);
}
