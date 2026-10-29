import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Copy,
  ExternalLink,
  MousePointerClick,
  Trophy,
  UserPlus,
  Users,
  Share2,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";

const AmbassadorDashboard = () => {
  const { referralCode } = useParams();

  const [ambassador, setAmbassador] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [ambassadorResponse, leaderboardResponse] =
          await Promise.all([
            api.get(`/ambassadors/${referralCode}`),
            api.get("/ambassadors/leaderboard"),
          ]);

        setAmbassador(ambassadorResponse.data.ambassador);
        setLeaderboard(leaderboardResponse.data.leaderboard);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [referralCode]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading Growth Dashboard...
      </div>
    );
  }

  if (!ambassador) {
    return (
      <div className="dashboard-loading">
        Ambassador not found.
      </div>
    );
  }

  const conversionRate =
    ambassador.totalClicks > 0
      ? (
          (ambassador.totalRegistrations /
            ambassador.totalClicks) *
          100
        ).toFixed(1)
      : "0.0";

  const rank =
    leaderboard.findIndex(
      (item) =>
        item.referralCode === ambassador.referralCode
    ) + 1;

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(
        ambassador.referralLink
      );

      toast.success("Referral link copied!");
    } catch {
      toast.error("Unable to copy referral link");
    }
  };

  const shareWhatsApp = () => {
    const message = `I'm inviting you to NxtWave's free "Build Your First AI Project in 60 Minutes" workshop.

Build a working AI project live and get hands-on experience.

Register here:
${ambassador.referralLink}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <main className="ambassador-dashboard">
      <header className="dashboard-navbar">
        <div className="dashboard-brand">
          <div className="brand-logo">N</div>

          <div>
            <strong>NxtWave</strong>
            <span>Growth Engine</span>
          </div>
        </div>

        <div className="partner-badge">
          Campus Growth Partner
        </div>
      </header>

      <section className="dashboard-wrapper">
        <div className="dashboard-welcome">
          <div>
            <p className="dashboard-eyebrow">
              GROWTH PARTNER DASHBOARD
            </p>

            <h1>
              Welcome back,{" "}
              {ambassador.name.split(" ")[0]}
            </h1>

            <p>
              {ambassador.college} · Track your campaign and
              help us reach 500 engineering students.
            </p>
          </div>

          <div className="goal-chip">
            <TrendingUp size={17} />
            500 Registration Challenge
          </div>
        </div>

        <section className="stats-grid">
          <StatCard
            icon={<MousePointerClick />}
            title="Link Clicks"
            value={ambassador.totalClicks}
            description="Total referral traffic"
          />

          <StatCard
            icon={<UserPlus />}
            title="Registrations"
            value={ambassador.totalRegistrations}
            description="Students registered"
          />

          <StatCard
            icon={<TrendingUp />}
            title="Conversion"
            value={`${conversionRate}%`}
            description="Click → registration"
          />

          <StatCard
            icon={<Trophy />}
            title="Your Rank"
            value={rank > 0 ? `#${rank}` : "—"}
            description="Campus leaderboard"
          />
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-panel referral-panel">
            <div className="panel-heading">
              <div>
                <span>YOUR GROWTH LINK</span>
                <h2>Invite more students</h2>
              </div>

              <Share2 size={21} />
            </div>

            <p className="panel-description">
              Every student who registers using this link is
              automatically attributed to you.
            </p>

            <div className="dashboard-referral-box">
              <span>{ambassador.referralLink}</span>

              <button onClick={copyReferralLink}>
                <Copy size={17} />
                Copy
              </button>
            </div>

            <button
              className="whatsapp-share"
              onClick={shareWhatsApp}
            >
              <Share2 size={18} />
              Share on WhatsApp
            </button>

            <a
              className="open-workshop"
              href={ambassador.referralLink}
              target="_blank"
              rel="noreferrer"
            >
              Preview registration page
              <ExternalLink size={15} />
            </a>
          </div>

          <div className="dashboard-panel goal-panel">
            <div className="panel-heading">
              <div>
                <span>YOUR IMPACT</span>
                <h2>Registration progress</h2>
              </div>

              <Users size={21} />
            </div>

            <div className="impact-number">
              {ambassador.totalRegistrations}
            </div>

            <p>students brought into the workshop</p>

            <div className="personal-progress">
              <div className="progress-information">
                <span>Next milestone</span>
                <strong>
                  {ambassador.totalRegistrations} / 15
                </strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-value"
                  style={{
                    width: `${Math.min(
                      (ambassador.totalRegistrations / 15) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="milestone-note">
              Reach 15 registrations to become a Top Growth
              Partner.
            </div>
          </div>
        </section>

        <section className="dashboard-panel leaderboard-panel">
          <div className="leaderboard-header">
            <div>
              <span>LIVE PERFORMANCE</span>
              <h2>Campus Leaderboard</h2>
            </div>

            <Trophy />
          </div>

          <div className="leaderboard-table">
            <div className="leaderboard-row leaderboard-labels">
              <span>Rank</span>
              <span>Growth Partner</span>
              <span>College</span>
              <span>Clicks</span>
              <span>Registrations</span>
            </div>

            {leaderboard.map((person, index) => (
              <div
                className={`leaderboard-row ${
                  person.referralCode ===
                  ambassador.referralCode
                    ? "current-ambassador"
                    : ""
                }`}
                key={person._id}
              >
                <span className="rank-number">
                  #{index + 1}
                </span>

                <span>{person.name}</span>

                <span>{person.college}</span>

                <span>{person.totalClicks}</span>

                <strong>
                  {person.totalRegistrations}
                </strong>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  description,
}) => {
  return (
    <article className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <p>{description}</p>
      </div>
    </article>
  );
};

export default AmbassadorDashboard;