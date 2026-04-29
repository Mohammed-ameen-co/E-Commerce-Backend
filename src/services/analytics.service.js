const orderModel = require("../models/orders.model");
const userModel = require("../models/user.model");
const inventoryModel = require("../models/inventory.model");
const variantModel = require("../models/variant.model");

// Helper function to get the start date based on the period
const getStartDate = (period) => {
  const now = new Date();

  if (period === "day") {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (period === "week") {
    const d = new Date();
    d.setDate(now.getDate() - 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  return new Date(now.getFullYear(), now.getMonth(), 1);
};

// Helper function to get the count of documents based on a filter
const getOrderCount = async (filter = {}) => {
  return await orderModel.countDocuments(filter);
};

const getUserCount = async (filter = {}) => {
  return await userModel.countDocuments(filter);
};

//helper function to get the total revenue based on a filter
const getRevenue = async (match = {}) => {
  const result = await orderModel.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  return result[0]?.total || 0;
};

//====================================================================================================//

// Analytics service functions// These functions will be called by the controller to get the analytics data

async function getOrderAnalytics() {
  const [today, weekly, monthly, totalOrders] = await Promise.all([
    getOrderCount({ createdAt: { $gte: getStartDate("day") } }),
    getOrderCount({ createdAt: { $gte: getStartDate("week") } }),
    getOrderCount({ createdAt: { $gte: getStartDate("month") } }),
    getOrderCount(),
  ]);
  return { today, weekly, monthly, totalOrders };
}

async function getRevenueAnalytics() {
  const [todayRevenue, weeklyRevenue, monthlyRevenue, totalRevenue] =
    await Promise.all([
      getRevenue({ createdAt: { $gte: getStartDate("day") } }),
      getRevenue({ createdAt: { $gte: getStartDate("week") } }),
      getRevenue({ createdAt: { $gte: getStartDate("month") } }),
      getRevenue(),
    ]);
  return { todayRevenue, weeklyRevenue, monthlyRevenue, totalRevenue };
}
async function getUserAnalytics() {
  const [today, weekly, monthly, totalUsers] = await Promise.all([
    getUserCount({ createdAt: { $gte: getStartDate("day") } }),
    getUserCount({ createdAt: { $gte: getStartDate("week") } }),
    getUserCount({ createdAt: { $gte: getStartDate("month") } }),
    getUserCount(),
  ]);
  return { today, weekly, monthly, totalUsers };
}

// async function getUsersStatusAnalytics() {}

// async function getProductAnalytics() {}

// async function getVariantAnalytics() {}

async function getUserByPeriod(period) {
  const startDate = getStartDate(period);
  return await getUserCount({ createdAt: { $gte: getStartDate(period) } });
}

async function getRevenueByPeriod(period) {
  const startDate = getStartDate(period);
  return await getRevenue({ createdAt: { $gte: getStartDate(period) } });
}

async function getRevenueByPeriod(period) {
  const startDate = getStartDate(period);
  return await getRevenue({ createdAt: { $gte: getStartDate(period) } });
}

// Placeholder functions for other analytics types
async function getOrderCountByPeriod(period) {
  const startDate = getStartDate(period);
  return await getOrderCount({ createdAt: { $gte: getStartDate(period) } });
}

module.exports = {
  getOrderAnalytics,
  getRevenueAnalytics,
  getRevenueByPeriod,
  getOrderCountByPeriod,
  getUserAnalytics,
  getUserByPeriod,
};
