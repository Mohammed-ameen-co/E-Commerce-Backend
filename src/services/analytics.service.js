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
    return d;
  }
  if (period === "month") {
    const d = new Date();
    d.setMonth(now.getMonth() - 1);
    return d;
  }
  return new Date(now.getFullYear(), now.getMonth(),1);
};

// Helper function to get the count of documents based on a filter
const getOrderCount = (filter = {})=>{
 return await orderModel.countDocuments(filter);
}

// Analytics service functions
async function getOrderAnalytics() {
    const{today, weekly, monthly, yearly} = await Promise.all([
        getOrderCount({createdAt: {$gte: getStartDate("day")}}),
        getOrderCount({createdAt: {$gte: getStartDate("week")}}),
        getOrderCount({createdAt: {$gte: getStartDate("month")}}),
        getOrderCount()
    ])
    return {today, weekly, monthly, yearly}
}

// Placeholder functions for other analytics types
async function getOrderAnalytics(period) {
    
    const satrtDate = getStartDate(period);
    return await orderModel.countDocuments({createdAt: {$gte: satrtDate}});
}

// async function getRevenueAnalytics() {}
// async function getUserAnalytics() {}
// async function getUsersStatusAnalytics() {}

// async function getProductAnalytics() {}

// async function getVariantAnalytics() {}

module.exports = {
  getOrderAnalytics,
  getRevenueAnalytics,
  getUserAnalytics,
  getUsersStatusAnalytics,
  getProductAnalytics,
  getVariantAnalytics,
};
