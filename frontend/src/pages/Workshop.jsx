import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  Code2,
  Copy,
  Share2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const Workshop = () => {
  const [searchParams] = useSearchParams();

  const referralCode = searchParams.get("ref") || "";

  useEffect(() => {
  if (!referralCode) return;

  const trackClick = async () => {
    try {
      await api.post("/ambassadors/track-click", {
        referralCode,
      });
    } catch (error) {
      console.error("Unable to track referral click:", error);
    }
  };

  trackClick();
}, [referralCode]);  

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    graduationYear: "2027",
  });

  const [loading, setLoading] = useState(false);
  const [registeredStudent, setRegisteredStudent] = useState(null);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/students/register", {
        ...formData,
        graduationYear: Number(formData.graduationYear),
        referredBy: referralCode || null,
      });

      setRegisteredStudent(response.data.student);

      toast.success("Registration successful!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(
        registeredStudent.referralLink
      );

      toast.success("Referral link copied!");
    } catch {
      toast.error("Unable to copy link");
    }
  };

  const shareOnWhatsApp = () => {
    const message = `I'm attending NxtWave's free "Build Your First AI Project in 60 Minutes" workshop.

Build a working AI project in just 60 minutes.

Join me here:
${registeredStudent.referralLink}`;

    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");
  };

  if (registeredStudent) {
    return (
      <main className="success-page">
        <section className="success-card">
          <div className="success-icon">
            <CheckCircle2 size={38} />
          </div>

          <p className="eyebrow">REGISTRATION CONFIRMED</p>

          <h1>
            You're in, {registeredStudent.name.split(" ")[0]}.
          </h1>

          <p className="success-description">
            Your seat for the AI Project Workshop is confirmed.
            Now invite your friends and build together.
          </p>

          <div className="registration-ticket">
            <div>
              <span>Your referral code</span>
              <strong>{registeredStudent.referralCode}</strong>
            </div>

            <div>
              <span>Workshop</span>
              <strong>AI Project in 60 Minutes</strong>
            </div>
          </div>

          <div className="unlock-card">
            <Sparkles size={22} />

            <div>
              <strong>Invite 3 friends</strong>
              <p>
                Share your personal link and unlock the AI
                Project Starter Kit.
              </p>
            </div>
          </div>

          <div className="referral-box">
            <span>{registeredStudent.referralLink}</span>

            <button onClick={copyReferralLink}>
              <Copy size={18} />
            </button>
          </div>

          <button
            className="primary-button whatsapp-button"
            onClick={shareOnWhatsApp}
          >
            <Share2 size={19} />
            Share on WhatsApp
          </button>

          <p className="small-note">
            Every successful registration through your link
            counts toward your referral progress.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="workshop-page">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={19} />
          </div>

          <span>NxtWave</span>
        </div>

        <div className="nav-badge">
          <span className="live-dot"></span>
          Free Live Workshop
        </div>
      </nav>

      <section className="workshop-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            BUILT FOR FINAL-YEAR ENGINEERS
          </div>

          <h1>
            Build Your First
            <span> AI Project </span>
            in 60 Minutes.
          </h1>

          <p className="hero-description">
            Stop just learning about AI. Build something you
            can actually show. Join a hands-on workshop and
            create your first AI project from scratch.
          </p>

          <div className="benefits">
            <div>
              <Code2 />
              <span>Build a working AI project</span>
            </div>

            <div>
              <Bot />
              <span>No prior AI experience required</span>
            </div>

            <div>
              <Clock3 />
              <span>Only 60 minutes</span>
            </div>

            <div>
              <CheckCircle2 />
              <span>GitHub-ready project</span>
            </div>
          </div>

          <div className="social-proof">
            <div className="avatars">
              <span>AS</span>
              <span>RV</span>
              <span>PK</span>
              <span>+</span>
            </div>

            <p>
              Join engineering students building their first
              AI project.
            </p>
          </div>
        </div>

        <div className="registration-card">
          <div className="form-heading">
            <p>RESERVE YOUR SEAT</p>
            <h2>Register for free</h2>
            <span>
              Takes less than 60 seconds.
            </span>
          </div>

          {referralCode && (
            <div className="referred-banner">
              <CheckCircle2 size={17} />
              You've been invited by a campus community member
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>

              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>WhatsApp number</label>

              <input
                type="tel"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>College</label>

              <input
                type="text"
                name="college"
                placeholder="Your college"
                value={formData.college}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Branch</label>

                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Computer Science">
                    Computer Science
                  </option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="AI & Data Science">
                    AI & Data Science
                  </option>
                  <option value="Electronics">
                    Electronics
                  </option>
                  <option value="Mechanical">
                    Mechanical
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Graduation</label>

                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                >
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                "Registering..."
              ) : (
                <>
                  Register Free
                  <ArrowRight size={19} />
                </>
              )}
            </button>

            <p className="form-footer">
              Free workshop • No credit card • Beginner friendly
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Workshop;