import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Share2,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";

const AmbassadorSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
  });

  const [loading, setLoading] = useState(false);

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

      const response = await api.post(
        "/ambassadors",
        formData
      );

      const ambassador = response.data.ambassador;

      toast.success("Growth Partner profile created!");

      navigate(
        `/ambassador/${ambassador.referralCode}`
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="ambassador-signup-page">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={19} />
          </div>

          <span>NxtWave</span>
        </div>

        <div className="nav-badge">
          Growth Partner Program
        </div>
      </nav>

      <section className="ambassador-signup-container">
        <div className="ambassador-pitch">
          <div className="hero-badge">
            <Sparkles size={16} />
            500 STUDENT GROWTH CHALLENGE
          </div>

          <h1>
            Become a Campus
            <span> Growth Partner.</span>
          </h1>

          <p className="hero-description">
            Help engineering students discover a hands-on AI
            workshop while competing with other campus growth
            partners.
          </p>

          <div className="partner-benefits">
            <div>
              <div className="partner-benefit-icon">
                <Share2 />
              </div>

              <div>
                <strong>Get your unique growth link</strong>
                <p>
                  Every registration through your link is
                  automatically attributed to you.
                </p>
              </div>
            </div>

            <div>
              <div className="partner-benefit-icon">
                <BarChart3 />
              </div>

              <div>
                <strong>Track your performance</strong>
                <p>
                  Monitor clicks, registrations and conversion
                  rate from your dashboard.
                </p>
              </div>
            </div>

            <div>
              <div className="partner-benefit-icon">
                <Trophy />
              </div>

              <div>
                <strong>Compete on the leaderboard</strong>
                <p>
                  See how your campus growth compares with
                  other partners.
                </p>
              </div>
            </div>
          </div>

          <div className="challenge-card">
            <Users size={23} />

            <div>
              <strong>Mission: 500 registrations</strong>
              <p>
                A referral-powered growth experiment designed
                to reach 500 final-year engineers in 7 days.
              </p>
            </div>
          </div>
        </div>

        <div className="registration-card ambassador-form-card">
          <div className="form-heading">
            <p>JOIN THE CHALLENGE</p>
            <h2>Create your profile</h2>
            <span>
              Your referral link will be generated instantly.
            </span>
          </div>

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
              <label>Email address</label>

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

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? (
                "Creating profile..."
              ) : (
                <>
                  Become a Growth Partner
                  <ArrowRight size={19} />
                </>
              )}
            </button>

            <p className="form-footer">
              Free to join • Instant dashboard • Unique
              referral link
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default AmbassadorSignup;