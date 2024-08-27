import cron from "node-cron";
import Calendar from "../models/calendarModel.js";
import logIfNodeEnvProd from "../utils/logIfNodeEnvProd.js";
import { NODE_ENV } from "../utils/config.js";

cron.schedule("*/5 * * * *", async () => {
  try {
    const now = new Date();

    logIfNodeEnvProd(`Running cron job at ${now}`)

    // Find documents that match the criteria
    const expiredBookings = await Calendar.find({
      status: "pending",
      paymentDeadline: { $lt: now },
    });

    logIfNodeEnvProd(`Found ${expiredBookings.length} expired pending bookings`)

    // Update the documents
    const result = await Calendar.updateMany(
      { status: "pending", paymentDeadline: { $lt: now } },
      {
        status: "available",
        menteeId: null,
        menteeUuid: null,
        paymentDeadline: null,
      }
    );

    logIfNodeEnvProd(`Update result: `, result)

    if (NODE_ENV === 'production') {
      if (result.modifiedCount > 0) {
        console.log(
          `✅ Reverted ${result.modifiedCount} expired pending bookings to available.`
        );
      } else {
        console.log(`🔎 No expired pending bookings were reverted.`);
      }
    }
  } catch (error) {
    logIfNodeEnvProd("❌ Error reverting expired pending bookings: ", error)
  }
});
