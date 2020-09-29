module.exports = [
  {
    order: {
      quantity: 5,
      price: 10,
    },
    expect: {
      executedQuantity: 0,
      isBuyOrder: false,
    },
  },
  {
    order: {
      quantity: 5,
      price: 50,
    },
    expect: {
      executedQuantity: 0,
      isBuyOrder: false,
    },
  },
  {
    order: {
      quantity: 9,
      price: 1,
    },
    expect: {
      executedQuantity: 0,
      isBuyOrder: false,
    },
  },
  {
    order: {
      quantity: 6,
      price: 1,
    },
    expect: {
      executedQuantity: 0,
      isBuyOrder: false,
    },
  },
];
