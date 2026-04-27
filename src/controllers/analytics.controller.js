const analyticsService = require("../services/analytics.service");

async function orderAnalytics(req, res) {
  try {
    const orderAnalyticsData = await analyticsService.getOrderAnalytics();
    res.status(200).json({
      message: "Order analytics endpoint is working",
      data: orderAnalyticsData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error at analytics controller",
      error: error.message,
    });
  }
}

async function revenueAnalytics(req, res) {
  try {
    const revenueAnalyticsData = await analyticsService.getRevenueAnalytics();
    res.status(200).json({
      message: "Revenue analytics endpoint is working",
      data: revenueAnalyticsData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error at analytics controller",
      error: error.message,
    });
  }
}

async function orderStatusAnalytics(req, res) {
  try {
    const orderStatusAnalyticsData = await analyticsService.getOrderStatusAnalytics();
    res.status(200).json({
      message: "Order status analytics endpoint is working",
      data: orderStatusAnalyticsData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error at analytics controller",
      error: error.message,
    });
  }
}

async function userAnalytics(req, res) {
  try {
    const userAnalyticsData = await analyticsService.getUserAnalytics();
    res.status(200).json({
      message: "User analytics endpoint is working",
      data: userAnalyticsData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error at analytics controller",
      error: error.message,
    });
  }
}

async function usersStatusAnalytics(req, res) {
  try {
    const usersStatusAnalyticsData = await analyticsService.getUsersStatusAnalytics();
    res.status(200).json({
      message: "Users status analytics endpoint is working",
      data: usersStatusAnalyticsData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error at analytics controller",
      error: error.message,
    });
  }
}

async function productAnalytics(req, res) {
  try {
    const productAnalyticsData = await analyticsService.getProductAnalytics();
    res.status(200).json({
      message: "Product analytics endpoint is working",
      data: productAnalyticsData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error at analytics controller",
      error: error.message,
    });
  }
}

async function variantAnalytics(req, res) {
  try {
    const variantAnalyticsData = await analyticsService.getVariantAnalytics();
    res.status(200).json({
      message: "Variant analytics endpoint is working",
      data: variantAnalyticsData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error at analytics controller",
      error: error.message,
    });
  }
}


module.exports = {
  getOrderAnalytics,
  getRevenueAnalytics,
  getUserAnalytics,
  getUsersStatusAnalytics,
  getProductAnalytics,
  getVariantAnalytics
}