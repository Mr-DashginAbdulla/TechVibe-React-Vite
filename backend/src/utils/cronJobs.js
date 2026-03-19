const cron = require("node-cron");
const Cart = require("../models/Cart");
const User = require("../models/User");
const sendEmail = require("./sendEmail");

// Run every hour to check for abandoned carts
cron.schedule("0 * * * *", async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Find carts updated more than 24 hours ago and not yet notified
    const abandonedCarts = await Cart.find({
      updatedAt: { $lt: twentyFourHoursAgo },
      abandonedNotified: false
    });

    if (abandonedCarts.length === 0) return;

    // Group items by user
    const usersCarts = {};
    abandonedCarts.forEach(item => {
      if (!usersCarts[item.userId]) {
        usersCarts[item.userId] = [];
      }
      usersCarts[item.userId].push(item);
    });

    // Send emails
    for (const userId of Object.keys(usersCarts)) {
      const user = await User.findById(userId);
      if (user && user.email) {
        const itemsCount = usersCarts[userId].length;
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Səbətinizdəki məhsullar sizi gözləyir!</h2>
            <p>Hörmətli ${user.firstName || 'Müştəri'},</p>
            <p>Sizin səbətinizdə hələ də <strong>${itemsCount}</strong> məhsul var. Onları əldə etmək üçün tələsin!</p>
            <br/>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart" style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Səbətə qayıt</a>
            <br/><br/>
            <p>Hörmətlə,<br/><strong>TechVibe Komandası</strong></p>
          </div>
        `;
        
        await sendEmail({
          to: user.email,
          subject: "TechVibe - Səbətinizdə məhsullar qalıb",
          html: htmlContent
        });

        // Mark as notified
        const itemIds = usersCarts[userId].map(i => i._id);
        await Cart.updateMany(
          { _id: { $in: itemIds } },
          { $set: { abandonedNotified: true } }
        );
      }
    }
    console.log(`[CRON] Abandoned cart job executed. Notified ${Object.keys(usersCarts).length} users.`);
  } catch (error) {
    console.error("[CRON] Error in abandoned cart job:", error);
  }
});
