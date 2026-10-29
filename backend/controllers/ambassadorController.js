import Ambassador from "../models/Ambassador.js";

const generateReferralCode = (name, college) => {
  const cleanName = name.replace(/\s+/g, "").toUpperCase().slice(0, 8);

  const cleanCollege = college
    .replace(/\s+/g, "")
    .toUpperCase()
    .slice(0, 6);

  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `${cleanCollege}-${cleanName}-${randomNumber}`;
};

export const createAmbassador = async (req, res) => {
  try {
    const { name, email, college, phone } = req.body;

    if (!name || !email || !college || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingAmbassador = await Ambassador.findOne({
      email: email.toLowerCase(),
    });

    if (existingAmbassador) {
      return res.status(400).json({
        success: false,
        message: "Ambassador already exists",
      });
    }

    let referralCode;
    let codeExists = true;

    while (codeExists) {
      referralCode = generateReferralCode(name, college);
      codeExists = await Ambassador.exists({ referralCode });
    }

    const ambassador = await Ambassador.create({
      name,
      email,
      college,
      phone,
      referralCode,
    });

    const referralLink = `${process.env.FRONTEND_URL}/workshop?ref=${referralCode}`;

    res.status(201).json({
      success: true,
      message: "Ambassador created successfully",
      ambassador: {
        id: ambassador._id,
        name: ambassador.name,
        email: ambassador.email,
        college: ambassador.college,
        referralCode: ambassador.referralCode,
        referralLink,
      },
    });
  } catch (error) {
    console.error("Create ambassador error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAmbassador = async (req, res) => {
  try {
    const { referralCode } = req.params;

    const ambassador = await Ambassador.findOne({
      referralCode,
    });

    if (!ambassador) {
      return res.status(404).json({
        success: false,
        message: "Ambassador not found",
      });
    }

    const referralLink =
      `${process.env.FRONTEND_URL}/workshop?ref=${ambassador.referralCode}`;

    return res.status(200).json({
      success: true,
      ambassador: {
        id: ambassador._id,
        name: ambassador.name,
        email: ambassador.email,
        college: ambassador.college,
        referralCode: ambassador.referralCode,
        referralLink,
        totalClicks: ambassador.totalClicks,
        totalRegistrations: ambassador.totalRegistrations,
      },
    });
  } catch (error) {
    console.error("Get ambassador error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getLeaderboard = async (req, res) => {
  try {
    const ambassadors = await Ambassador.find()
      .sort({ totalRegistrations: -1 })
      .limit(10)
      .select(
        "name college referralCode totalClicks totalRegistrations"
      );

    return res.status(200).json({
      success: true,
      leaderboard: ambassadors,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const trackReferralClick = async (req, res) => {
  try {
    const { referralCode } = req.body;

    if (!referralCode) {
      return res.status(400).json({
        success: false,
        message: "Referral code is required",
      });
    }

    const ambassador = await Ambassador.findOne({
      referralCode,
    });

    if (!ambassador) {
      return res.status(404).json({
        success: false,
        message: "Referral code not found",
      });
    }

    ambassador.totalClicks += 1;

    await ambassador.save();

    return res.status(200).json({
      success: true,
      message: "Referral click tracked",
      totalClicks: ambassador.totalClicks,
    });
  } catch (error) {
    console.error("Track click error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};