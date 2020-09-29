module.exports = [
  {
    order: {
      quantity: 2,
      price: 10,
    },
    expect: {
      executedQuantity: 0,
      isBuyOrder: true,
    },
  },
  {
    order: {
      quantity: 5,
      price: 30,
    },
    expect: {
      executedQuantity: 0,
      isBuyOrder: true,
    },
  },
  {
    order: {
      quantity: 9,
      price: 4,
    },
    expect: {
      executedQuantity: 0,
      isBuyOrder: true,
    },
  },
  {
    order: {
      quantity: 6,
      price: 1,
    },
    expect: {
      executedQuantity: 0,
      isBuyOrder: true,
    },
  },
];
