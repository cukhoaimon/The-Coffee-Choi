const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require("../models/Product");

const ProductAttribute = require("../models/ProductAttribute");
const Coupon = require("../models/Coupon");

const dotenv = require("dotenv");
const PaymentAccount = require("../models/PaymentAccount");
dotenv.config({ path: "./config.env" });

// Get all orders
exports.getAllOrders = catchAsync(async (req, res, next) => {
  let orders;
  if (req.user.role == "admin") {
    orders = await Order.find()
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          model: "Product",
          select: "name",
        },
      })
      .populate({
        path: "couponUsed",
        model: "Coupon",
        select: "code discountValue",
      })
      .sort({ createdTime: -1 });
  } else {
    orders = await Order.find({ userID: req.user._id })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          model: "Product",
          select: "name",
        },
      })
      .populate({
        path: "couponUsed",
        model: "Coupon",
        select: "code discountValue",
      })
      .sort({ createdTime: -1 });
  }

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

// Get order by ID
exports.getAllOrdersByUserId = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.params.id }).populate({
    path: "OrderItem",
    populate: {
      path: "product",
      model: "Product",
      select: "name",
    },
    select: "quantity",
    select: "price",
  });
  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

// Create order
exports.createOrder = catchAsync(async (req, res, next) => {
  // Example request body:
  /*   {
    "products":[
        {
            "id":"65b08d630b7758bc68941d60",
            "quantity":1,
            "toppings":["65b1b367e1f7c6d2175413fc","65b1b374e1f7c6d217541400"],
            "size": "65b1b357e1f7c6d2175413f8"
        },
         {
            "id":"65b08d630b7758bc68941d60",
            "quantity":1,
            "toppings":["65b1b367e1f7c6d2175413fc"],
            "size": "65b1b357e1f7c6d2175413f8"
        }
    ]
} */

  // Check for coupon
  let coupon = null;
  if (req.body.couponUsed) {
    coupon = await Coupon.findOne({ code: req.body.couponUsed });
    if (!coupon) return next(new AppError("Invalid coupon", 400));
    coupon.timeUsed++;
    await coupon.save();
  }

  // Create order items
  const orderItems = [];
  for (const productItem of req.body.products) {
    let productItemPrice = 0;

    // Find product
    const product = await Product.findById(productItem.id);
    if (!product) return next(new AppError("Invalid product", 400));
    productItemPrice += product.price * productItem.quantity;
    productItemPrice -=
      (product.discount / 100) * product.price * productItem.quantity;
    product.sold += productItem.quantity;
    await product.save();

    // Topping
    const toppingString = [];
    if (productItem.toppings) {
      // Find topping
      for (const toppingItem of productItem.toppings) {
        const topping = await ProductAttribute.findById(toppingItem);
        if (!topping) return next(new AppError("Invalid topping", 400));
        productItemPrice += topping.price;
        toppingString.push(topping.name);
      }
    }

    // Size
    let sizeChar = "";
    const size = await ProductAttribute.findById(productItem.size);
    if (!size) return next(new AppError("Invalid size", 400));
    productItemPrice += size.price;
    sizeChar = size.name;

    // Create order item
    const orderItem = await OrderItem.create({
      product: productItem.id,
      quantity: productItem.quantity,
      toppings: toppingString.join(", "),
      size: sizeChar,
      price: productItemPrice,
    });
    orderItems.push(orderItem);
  }

  // Create order
  let totalMoney = orderItems.reduce((a, b) => a + b.price, 0);
  const order = await Order.create({
    userID: req.user.id,
    orderItems: orderItems.map((item) => item.id),
    couponUsed: coupon ? coupon._id : null,
    totalMoney: coupon
      ? totalMoney - (coupon.discountValue / 100) * totalMoney + 30000
      : totalMoney + 30000,
  });

  const paymentAccount = await PaymentAccount.findOne({ user: req.user.id });
  paymentAccount.balance -= order.totalMoney;
  await paymentAccount.save();

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

// Update status
exports.updateStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (req.body.status == "Rejected") {
    // Refund
    const paymentAccountsServerUrl = `${API_SERVER}/v1/paymentAccounts`;

    // Get payment account
    const adminPaymentAccount = await axios.get(
      paymentAccountsServerUrl + "/" + req.user._id
    );
    // Update admin balance
    // console.log(adminPaymentAccount.data.data.paymentAccount);
    const updateBalance =
      adminPaymentAccount.data.data.paymentAccount.balance - order.totalMoney;
    await axios.patch(paymentAccountsServerUrl + "/" + req.user._id, {
      balance: updateBalance,
    });

    // Update user balance
    const userPaymentAccount = await axios.get(
      paymentAccountsServerUrl + "/" + order.userID
    );
    //console.log(userPaymentAccount.data.data.paymentAccount);
    // console.log(userPaymentAccount.data.data.paymentAccount.balance);
    const updateUserBalance =
      userPaymentAccount.data.data.paymentAccount.balance + order.totalMoney;
    await axios.patch(paymentAccountsServerUrl + "/" + order.userID, {
      balance: updateUserBalance,
    });

    // update product sold
    const orderItems = await OrderItem.find({ order: order.id });
    for (const orderItem of orderItems) {
      const product = await Product.findById(orderItem.product);
      product.sold -= orderItem.quantity;
      await product.save();
    }

    // Update coupon
    if (order.couponUsed) {
      const coupon = await Coupon.findById(order.couponUsed);
      coupon.timeUsed--;
      await coupon.save();
    }

    // Update status
    order.status = req.body.status;
  } else {
    order.status = req.body.status;
  }
  await order.save();
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

// Get order by ID
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({
    path: "orderItems",
    populate: {
      path: "product",
      model: "Product",
      select: "name image",
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
