const mongoose = require("mongoose");
// const cron = require("node-cron");

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/salek", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  user_id: String,
  date_time: { type: Date, default: Date.now },
});

const Order = mongoose.model("order", userSchema);

// Function to Get and Delete Expired Orders
const deleteExpiredOrders = async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Set date to 1 month ago
    console.log(oneMonthAgo);


    // Find expired orders
    const expiredOrders = await Order.find({ date_time: { $lt: oneMonthAgo } });

    console.log(expiredOrders);

    
    if (expiredOrders.length > 0) {
      console.log(`Found ${expiredOrders.length} expired orders. Deleting...`);

      // Delete expired orders
      const result = await Order.deleteMany({ date_time: { $lt: oneMonthAgo } });

      console.log(`Deleted ${result.deletedCount} expired orders.`);
    } else {
      console.log("No expired orders found.");
    }
  } catch (error) {
    console.error("Error deleting expired orders:", error);
  }
};

// Run the function immediately
deleteExpiredOrders();

console.log("Cron job scheduled to delete expired orders daily at midnight.");
