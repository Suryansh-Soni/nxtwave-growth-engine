import Ambassador from "../models/Ambassador.js";
import Student from "../models/Student.js";

export const getGrowthAnalytics = async (req, res) => {
  try {
    const totalRegistrations = await Student.countDocuments();

    const totalAmbassadors = await Ambassador.countDocuments();

    const ambassadorStats = await Ambassador.aggregate([
      {
        $group: {
          _id: null,
          totalClicks: { $sum: "$totalClicks" },
          ambassadorRegistrations: {
            $sum: "$totalRegistrations",
          },
        },
      },
    ]);

    const totalClicks =
      ambassadorStats[0]?.totalClicks || 0;

    const ambassadorRegistrations =
      ambassadorStats[0]?.ambassadorRegistrations || 0;

    const directRegistrations = await Student.countDocuments({
      referralType: "direct",
    });

    const studentReferralRegistrations =
      await Student.countDocuments({
        referralType: "student",
      });

    const conversionRate =
      totalClicks > 0
        ? ((ambassadorRegistrations / totalClicks) * 100).toFixed(1)
        : 0;

    const target = 500;

    const remaining = Math.max(
      target - totalRegistrations,
      0
    );

    const progress = Math.min(
      ((totalRegistrations / target) * 100).toFixed(1),
      100
    );

    const topAmbassadors = await Ambassador.find()
      .sort({ totalRegistrations: -1 })
      .limit(5)
      .select(
        "name college referralCode totalClicks totalRegistrations"
      );

    const recentRegistrations = await Student.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select(
        "name college referralType referredBy createdAt"
      );

    return res.status(200).json({
      success: true,

      campaign: {
        target,
        totalRegistrations,
        remaining,
        progress,
        totalClicks,
        conversionRate,
        totalAmbassadors,
      },

      channels: {
        ambassadors: ambassadorRegistrations,
        studentReferrals: studentReferralRegistrations,
        direct: directRegistrations,
      },

      topAmbassadors,

      recentRegistrations,
    });
  } catch (error) {
    console.error("Growth analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load growth analytics",
    });
  }
};