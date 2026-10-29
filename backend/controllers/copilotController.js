import Ambassador from "../models/Ambassador.js";
import Student from "../models/Student.js";

export const generateGrowthStrategy = async (req, res) => {
  try {
    const target = 500;
    const budget = 2000;
    const campaignDays = 7;

    const totalRegistrations = await Student.countDocuments();

    const totalAmbassadors = await Ambassador.countDocuments();

    const ambassadors = await Ambassador.find().sort({
      totalRegistrations: -1,
    });

    const totalClicks = ambassadors.reduce(
      (sum, ambassador) => sum + ambassador.totalClicks,
      0
    );

    const ambassadorRegistrations = ambassadors.reduce(
      (sum, ambassador) =>
        sum + ambassador.totalRegistrations,
      0
    );

    const studentReferrals = await Student.countDocuments({
      referralType: "student",
    });

    const directRegistrations = await Student.countDocuments({
      referralType: "direct",
    });

    const remaining = Math.max(
      target - totalRegistrations,
      0
    );

    const conversionRate =
      totalClicks > 0
        ? (ambassadorRegistrations / totalClicks) * 100
        : 0;

    const daysElapsed = Math.max(
      Number(req.query.day) || 1,
      1
    );

    const daysRemaining = Math.max(
      campaignDays - daysElapsed,
      1
    );

    const requiredPerDay = Math.ceil(
      remaining / daysRemaining
    );

    const currentDailyAverage =
      totalRegistrations / daysElapsed;

    const projectedRegistrations = Math.round(
      currentDailyAverage * campaignDays
    );

    let status = "ON TRACK";

    if (projectedRegistrations < target * 0.7) {
      status = "AT RISK";
    } else if (projectedRegistrations < target) {
      status = "NEEDS ACCELERATION";
    }

    let strongestChannel = "Direct";

    const channelData = [
      {
        name: "Campus Ambassadors",
        registrations: ambassadorRegistrations,
      },
      {
        name: "Student Referrals",
        registrations: studentReferrals,
      },
      {
        name: "Direct",
        registrations: directRegistrations,
      },
    ];

    channelData.sort(
      (a, b) => b.registrations - a.registrations
    );

    strongestChannel = channelData[0].name;

    const topAmbassador = ambassadors[0] || null;

    let budgetAllocation;

    if (ambassadorRegistrations >= directRegistrations) {
      budgetAllocation = [
        {
          channel: "Campus Ambassador Incentives",
          amount: 900,
          reason:
            "Scale the channel already producing attributed registrations.",
        },
        {
          channel: "WhatsApp Referral Rewards",
          amount: 600,
          reason:
            "Encourage registered students to invite classmates.",
        },
        {
          channel: "Retargeting / Creative Tests",
          amount: 500,
          reason:
            "Test urgency-led creatives on students who have not converted.",
        },
      ];
    } else {
      budgetAllocation = [
        {
          channel: "High-intent Promotion",
          amount: 900,
          reason:
            "Direct acquisition is currently producing more registrations.",
        },
        {
          channel: "Campus Ambassador Activation",
          amount: 700,
          reason:
            "Build a lower-cost distributed acquisition network.",
        },
        {
          channel: "Referral Rewards",
          amount: 400,
          reason:
            "Create a secondary viral acquisition loop.",
        },
      ];
    }

    const actions = [];

    if (conversionRate < 20 && totalClicks > 5) {
      actions.push({
        priority: "HIGH",
        action: "Improve workshop landing-page conversion",
        reason: `Referral conversion is only ${conversionRate.toFixed(
          1
        )}%. Improve headline, proof and CTA before buying more traffic.`,
      });
    } else {
      actions.push({
        priority: "HIGH",
        action: "Increase qualified referral traffic",
        reason:
          "Conversion is acceptable; the larger constraint is acquisition volume.",
      });
    }

    actions.push({
      priority: "HIGH",
      action: "Activate top campus ambassadors",
      reason: topAmbassador
        ? `${topAmbassador.name} currently leads with ${topAmbassador.totalRegistrations} registrations. Replicate their distribution playbook across other campuses.`
        : "Recruit initial campus ambassadors from engineering communities.",
    });

    actions.push({
      priority: "MEDIUM",
      action: "Push the 3-friend referral loop",
      reason:
        "Every registered student receives a unique referral link, creating acquisition without additional ad spend.",
    });

    const insights = [
      `${totalRegistrations} of ${target} registrations achieved.`,
      `${remaining} registrations remain.`,
      `${requiredPerDay} registrations per day are now required.`,
      `${strongestChannel} is currently the strongest acquisition channel.`,
      `${conversionRate.toFixed(
        1
      )}% ambassador click-to-registration conversion.`,
    ];

    return res.status(200).json({
      success: true,

      analysis: {
        status,
        target,
        registrations: totalRegistrations,
        remaining,
        daysElapsed,
        daysRemaining,
        requiredPerDay,
        currentDailyAverage:
          currentDailyAverage.toFixed(1),
        projectedRegistrations,
        conversionRate: conversionRate.toFixed(1),
        strongestChannel,
        totalAmbassadors,
      },

      insights,

      actions,

      budget: {
        total: budget,
        allocation: budgetAllocation,
      },
    });
  } catch (error) {
    console.error("Growth Copilot error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate growth strategy",
    });
  }
};