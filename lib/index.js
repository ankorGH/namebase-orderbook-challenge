const fs = require("fs");
const Order = require("./order");

class Exchange {
  constructor(store = "store.txt") {
    this.store = store;

    if (fs.existsSync(store)) {
      this._loadStore();
    } else {
      this._loadDefaultOrderBook();
    }
  }

  sync() {
    this._loadStore();
  }

  buy(quantity, price) {
    const order = new Order(true, quantity, price);

    const matchedOrders = this.orderBook.sellOrders.filter(
      (sellOrder) =>
        sellOrder.price <= price &&
        sellOrder.executedQuantity !== sellOrder.quantity
    );

    if (matchedOrders.length === 0) {
      this.orderBook.buyOrders.push(order);
      this._arrangeBuyOrders();
      this._writeToStore();
      return order;
    }

    for (let matchedOrder of matchedOrders) {
      const matchedOrderIndex = this.orderBook.sellOrders.findIndex(
        (order) => order.id === matchedOrder.id
      );
      if (matchedOrderIndex === -1) {
        continue;
      }

      const matchedOrderRemainderQuantity =
        matchedOrder.quantity - matchedOrder.executedQuantity;
      const orderRemainderQuantity = order.quantity - order.executedQuantity;

      if (matchedOrderRemainderQuantity >= orderRemainderQuantity) {
        this.orderBook.sellOrders[
          matchedOrderIndex
        ].executedQuantity += orderRemainderQuantity;
        order.executedQuantity += orderRemainderQuantity;
        break;
      } else {
        this.orderBook.sellOrders[
          matchedOrderIndex
        ].executedQuantity += matchedOrderRemainderQuantity;
        order.executedQuantity += matchedOrderRemainderQuantity;
      }
    }

    this.orderBook.buyOrders.push(order);
    this._arrangeOrders();
    this._writeToStore();

    return order;
  }

  sell(quantity, price) {
    const order = new Order(false, quantity, price);

    const matchedOrders = this.orderBook.buyOrders.filter(
      (order) => order.price >= price && order.price !== order.executedQuantity
    );

    if (matchedOrders.length === 0) {
      this.orderBook.sellOrders.push(order);
      this._arrangeSellOrders();
      this._writeToStore();
      return order;
    }

    for (let matchedOrder of matchedOrders) {
      const matchedOrderIndex = this.orderBook.buyOrders.findIndex(
        (order) => order.id === matchedOrder.id
      );

      if (matchedOrderIndex === -1) {
        continue;
      }

      const matchedOrderRemainderQuantity =
        matchedOrder.quantity - matchedOrder.executedQuantity;
      const orderRemainderQuantity = order.quantity - order.executedQuantity;

      if (matchedOrderRemainderQuantity >= orderRemainderQuantity) {
        this.orderBook.buyOrders[
          matchedOrderIndex
        ].executedQuantity += orderRemainderQuantity;
        order.executedQuantity += orderRemainderQuantity;
        break;
      } else {
        this.orderBook.buyOrders[
          matchedOrderIndex
        ].executedQuantity += matchedOrderRemainderQuantity;
        order.executedQuantity += matchedOrderRemainderQuantity;
      }
    }

    this.orderBook.sellOrders.push(order);
    this._arrangeOrders();
    this._writeToStore();

    return order;
  }

  getQuantityAtPrice(price) {
    const buyOrders = this.orderBook.buyOrders.filter(
      (order) =>
        order.price === price && order.quantity !== order.executedQuantity
    );
    if (buyOrders.length > 0) {
      return buyOrders.reduce((o1, o2) => o1.quantity + o2.quantity);
    }

    const sellOrders = this.orderBook.sellOrders.filter(
      (order) =>
        order.price === price && order.quantity !== order.executedQuantity
    );
    if (sellOrders.length > 0) {
      return sellOrders.reduce((o1, o2) => o1.quantity + o2.quantity);
    }

    return 0;
  }

  getOrder(id) {
    const buyOrderIndex = this.orderBook.buyOrders.findIndex(
      (order) => order.id === id
    );
    if (buyOrderIndex !== -1) {
      return this.orderBook.buyOrders[buyOrderIndex];
    }

    const sellOrderIndex = this.orderBook.sellOrders.findIndex(
      (order) => order.id === id
    );
    if (sellOrderIndex !== -1) {
      return this.orderBook.sellOrders[sellOrderIndex];
    }

    return null;
  }

  _arrangeBuyOrders() {
    this.orderBook.buyOrders.sort((orderOne, orderTwo) => {
      return orderOne.price < orderTwo.price;
    });
  }

  _arrangeSellOrders() {
    this.orderBook.sellOrders.sort((orderOne, orderTwo) => {
      return orderOne.price > orderTwo.price;
    });
  }

  _arrangeOrders() {
    this._arrangeBuyOrders();
    this._arrangeSellOrders();
  }

  _writeToStore() {
    fs.truncateSync(this.store);
    fs.appendFileSync(this.store, JSON.stringify(this.orderBook));
  }

  _loadStore() {
    const content = fs.readFileSync(this.store, {
      encoding: "ascii",
    });
    if (content.length === 0) {
      this.orderBook = {
        buyOrders: [],
        sellOrders: [],
      };
      return;
    }

    try {
      const parsedContent = JSON.parse(content);
      this.orderBook = parsedContent;
    } catch (err) {
      if (err.message.includes("Unexpected token")) {
        this._loadDefaultOrderBook();
      }
    }
  }

  _loadDefaultOrderBook() {
    this.orderBook = {
      buyOrders: [],
      sellOrders: [],
    };
  }

  _logOrderBook() {
    console.log(this.orderBook);
  }
}

module.exports = Exchange;

// const ex = new Exchange();
// ex.buy(10, 2);
// ex.buy(5, 3);
// ex.sell(50, 8);
// ex.sell(5, 12);
// ex.buy(51, 9);
// ex.sell(10, 12);
// ex.sell(1, 12);
// ex.sell(2, 12);
// ex.buy(15, 13);
// ex.buy(5, 2);
// ex.getQuantityAtPrice(12);
// ex._logOrderBook();
