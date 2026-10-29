import Student from "../models/Student.js";
import Ambassador from "../models/Ambassador.js";

const generateStudentReferralCode = (name) => {
  const cleanName = name
    .replace(/\s+/g, "")
    .toUpperCase()
    .slice(0, 8);

  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `STU-${cleanName}-${randomNumber}`;
};

export const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      college,
      branch,
      graduationYear,
      referredBy,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !college ||
      !branch ||
      !graduationYear
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingStudent = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already registered",
      });
    }

    let referralType = "direct";

    if (referredBy) {
      const ambassador = await Ambassador.findOne({
        referralCode: referredBy,
      });

      if (ambassador) {
        referralType = "ambassador";

        ambassador.totalRegistrations += 1;

        await ambassador.save();
      } else {
        const referringStudent = await Student.findOne({
          referralCode: referredBy,
        });

        if (referringStudent) {
          referralType = "student";

          referringStudent.totalReferrals += 1;

          await referringStudent.save();
        }
      }
    }

    let referralCode;
    let exists = true;

    while (exists) {
      referralCode = generateStudentReferralCode(name);

      exists = await Student.exists({
        referralCode,
      });
    }

    const student = await Student.create({
      name,
      email,
      phone,
      college,
      branch,
      graduationYear,
      referralCode,
      referredBy: referredBy || null,
      referralType,
    });

    const referralLink =
      `${process.env.FRONTEND_URL}/workshop?ref=${student.referralCode}`;

    return res.status(201).json({
      success: true,
      message: "Workshop registration successful",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        college: student.college,
        referralCode: student.referralCode,
        referralLink,
        referralType: student.referralType,
      },
    });
  } catch (error) {
    console.error("Student registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};