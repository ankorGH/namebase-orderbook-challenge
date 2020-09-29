const fs = require("fs");

const Exchange = require("../index");
const buyOrders = require("./resources/buy-orders.resource");
const sellOrders = require("./resources/sell-order.resource");

jest.mock("fs");

describe("buy ice cream scoops", () => {
  it("places order to buy ice cream scoops", () => {
    const ex = new Exchange();

    for (let buyOrder of buyOrders) {
      const {
        order: { price, quantity },
        expect: { executedQuantity, isBuyOrder },
      } = buyOrder;
      const order = ex.buy(quantity, price);

      expect(typeof order.id).toBe("string");
      expect(order.price).toBe(price);
      expect(order.quantity).toBe(quantity);
      expect(order.executedQuantity).toBe(executedQuantity);
      expect(order.isBuyOrder).toBe(isBuyOrder);
    }
  });
});

describe("sell ice cream scoops", () => {
  it("places order to sell ice sceam scoops", () => {
    const ex = new Exchange();

    for (let sellOrder of sellOrders) {
      const {
        order: { price, quantity },
        expect: { executedQuantity, isBuyOrder },
      } = sellOrder;
      const order = ex.sell(quantity, price);

      expect(typeof order.id).toBe("string");
      expect(order.price).toBe(price);
      expect(order.quantity).toBe(quantity);
      expect(order.executedQuantity).toBe(executedQuantity);
      expect(order.isBuyOrder).toBe(false);
    }
  });
});

describe("buy and sell ice cream scoops", () => {
  it("sells ice cream scoops to buyer based on time", () => {
    const ex = new Exchange();
    let order1 = ex.buy(40, 8);
    let order2 = ex.buy(10, 8);
    ex.sell(30, 7);

    order1 = ex.getOrder(order1.id);
    expect(order1.executedQuantity).toBe(30);
    expect(order2.executedQuantity).toBe(0);
  });

  it("buys ice scream scoops from sellers based on price-time", () => {
    const ex = new Exchange();
    let order1 = ex.sell(10, 3);
    let order2 = ex.sell(4, 5);
    let order3 = ex.sell(9, 5);
    let order4 = ex.buy(15, 5);

    order1 = ex.getOrder(order1.id);
    order2 = ex.getOrder(order2.id);
    order3 = ex.getOrder(order3.id);
    order4 = ex.getOrder(order4.id);

    expect(order4.executedQuantity).toBe(15);
    expect(order1.executedQuantity).toBe(10);
    expect(order2.executedQuantity).toBe(4);
    expect(order3.executedQuantity).toBe(1);
  });
});
