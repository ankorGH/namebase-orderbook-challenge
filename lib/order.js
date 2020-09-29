const uuidV4 = require("uuid").v4;

class Order {
  constructor(isBuyOrder, quantity, price, executedQuantity = 0) {
    this.id = uuidV4();
    this.isBuyOrder = isBuyOrder;
    this.quantity = quantity;
    this.price = price;
    this.executedQuantity = executedQuantity;
    this.createdAt = new Date();
  }
}

module.exports = Order;
