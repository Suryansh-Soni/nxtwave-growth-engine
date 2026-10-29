import { useEffect, useState } from "react";
import {
  Activity,
  BrainCircuit,
  MousePointerClick,
  Target,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";

import api from "../services/api";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [strategy, setStrategy] = useState(null);
  const [copilotLoading, setCopilotLoading] = useState(false);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await api.get("/admin/analytics");

        setAnalytics(response.data);
      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const runGrowthCopilot = async () => {
    try {
      setCopilotLoading(true);

      const response = await api.get(
        "/copilot/strategy?day=2"
      );

      setStrategy(response.data);
    } catch (error) {
      console.error("Copilot error:", error);
    } finally {
      setCopilotLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading Growth Command Center...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="dashboard-loading">
        Unable to load analytics.
      </div>
    );
  }

  const { campaign, channels } = analytics;

  return (
    <main className="admin-dashboard">
      <header className="dashboard-navbar">
        <div className="dashboard-brand">
          <div className="brand-logo">N</div>

          <div>
            <strong>NxtWave</strong>
            <span>Growth Command Center</span>
          </div>
        </div>

        <div className="admin-live">
          <span />
          Campaign Live
        </div>
      </header>

      <section className="admin-wrapper">
        <div className="admin-heading">
          <div>
            <p className="dashboard-eyebrow">
              7-DAY GROWTH CHALLENGE
            </p>

            <h1>500 Registration Command Center</h1>

            <p>
              Real-time view of acquisition, referrals and
              campaign performance.
            </p>
          </div>

          <div className="budget-box">
            <span>Campaign budget</span>
            <strong>₹2,000</strong>
          </div>
        </div>

        <section className="admin-stats">
          <AdminStat
            icon={<Target />}
            label="Registrations"
            value={campaign.totalRegistrations}
            secondary={`/ ${campaign.target}`}
          />

          <AdminStat
            icon={<MousePointerClick />}
            label="Referral Clicks"
            value={campaign.totalClicks}
            secondary="tracked"
          />

          <AdminStat
            icon={<TrendingUp />}
            label="Conversion"
            value={`${campaign.conversionRate}%`}
            secondary="click → signup"
          />

          <AdminStat
            icon={<Users />}
            label="Growth Partners"
            value={campaign.totalAmbassadors}
            secondary="active network"
          />
        </section>

        <section className="campaign-progress-card">
          <div className="campaign-progress-heading">
            <div>
              <span>MISSION PROGRESS</span>

              <h2>
                {campaign.totalRegistrations} of{" "}
                {campaign.target} students
              </h2>
            </div>

            <strong>{campaign.progress}%</strong>
          </div>

          <div className="campaign-progress-track">
            <div
              style={{
                width: `${campaign.progress}%`,
              }}
            />
          </div>

          <div className="campaign-progress-footer">
            <span>
              {campaign.remaining} registrations remaining
            </span>

            <span>7 day campaign</span>
          </div>
        </section>

        <section className="admin-main-grid">
          <div className="admin-card">
            <div className="admin-card-heading">
              <div>
                <span>ACQUISITION</span>
                <h2>Registration Channels</h2>
              </div>

              <Activity />
            </div>

            <Channel
              name="Campus Ambassadors"
              value={channels.ambassadors}
              total={campaign.totalRegistrations}
            />

            <Channel
              name="Student Referrals"
              value={channels.studentReferrals}
              total={campaign.totalRegistrations}
            />

            <Channel
              name="Direct Registrations"
              value={channels.direct}
              total={campaign.totalRegistrations}
            />
          </div>

          <div className="admin-card ai-preview-card">
            <div className="admin-card-heading">
              <div>
                <span>AI GROWTH COPILOT</span>
                <h2>Campaign Intelligence</h2>
              </div>

              <BrainCircuit />
            </div>

            <div className="ai-status">
              <Zap size={17} />

              <div>
                <strong>Analytics connected</strong>

                <p>
                  Analyze live campaign metrics and generate
                  the next best growth actions.
                </p>
              </div>
            </div>

            <div className="ai-question">
              <span>Growth decision</span>

              <p>
                Given our conversion rate, remaining target
                and ₹2,000 budget, what should we prioritize
                tomorrow?
              </p>
            </div>

            <button
              className="ai-button ai-button-active"
              onClick={runGrowthCopilot}
              disabled={copilotLoading}
            >
              <BrainCircuit size={18} />

              {copilotLoading
                ? "Analyzing Campaign..."
                : "Analyze Campaign"}
            </button>

            {strategy && (
              <div className="copilot-results">
                <div className="copilot-status">
                  <span>CAMPAIGN STATUS</span>

                  <strong>
                    {strategy.analysis.status}
                  </strong>
                </div>

                <div className="copilot-metric-grid">
                  <div>
                    <span>Need / Day</span>

                    <strong>
                      {strategy.analysis.requiredPerDay}
                    </strong>
                  </div>

                  <div>
                    <span>Projected</span>

                    <strong>
                      {
                        strategy.analysis
                          .projectedRegistrations
                      }
                    </strong>
                  </div>

                  <div>
                    <span>Best Channel</span>

                    <strong>
                      {strategy.analysis.strongestChannel}
                    </strong>
                  </div>
                </div>

                <div className="copilot-section">
                  <span>CAMPAIGN INSIGHTS</span>

                  {strategy.insights.map(
                    (insight, index) => (
                      <div
                        className="copilot-action"
                        key={index}
                      >
                        <div>{index + 1}</div>

                        <section>
                          <p>{insight}</p>
                        </section>
                      </div>
                    )
                  )}
                </div>

                <div className="copilot-section">
                  <span>NEXT 3 ACTIONS</span>

                  {strategy.actions.map(
                    (item, index) => (
                      <div
                        className="copilot-action"
                        key={index}
                      >
                        <div>{index + 1}</div>

                        <section>
                          <strong>
                            {item.action}
                          </strong>

                          <p>{item.reason}</p>
                        </section>
                      </div>
                    )
                  )}
                </div>

                <div className="copilot-section">
                  <span>₹2,000 BUDGET ALLOCATION</span>

                  {strategy.budget.allocation.map(
                    (item, index) => (
                      <div
                        className="budget-allocation"
                        key={index}
                      >
                        <div>
                          <strong>
                            {item.channel}
                          </strong>

                          <p>{item.reason}</p>
                        </div>

                        <strong>
                          ₹{item.amount}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="admin-card admin-leaderboard">
          <div className="admin-card-heading">
            <div>
              <span>TOP PERFORMERS</span>

              <h2>Growth Partner Leaderboard</h2>
            </div>

            <Trophy />
          </div>

          <div className="admin-leaderboard-table">
            {analytics.topAmbassadors.length === 0 ? (
              <p className="empty-state">
                No ambassadors yet.
              </p>
            ) : (
              analytics.topAmbassadors.map(
                (ambassador, index) => (
                  <div
                    className="admin-leaderboard-row"
                    key={ambassador._id}
                  >
                    <div className="admin-rank">
                      #{index + 1}
                    </div>

                    <div>
                      <strong>
                        {ambassador.name}
                      </strong>

                      <span>
                        {ambassador.college}
                      </span>
                    </div>

                    <div>
                      <span>Clicks</span>

                      <strong>
                        {ambassador.totalClicks}
                      </strong>
                    </div>

                    <div>
                      <span>Registrations</span>

                      <strong>
                        {
                          ambassador.totalRegistrations
                        }
                      </strong>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </section>

        <section className="admin-card recent-card">
          <div className="admin-card-heading">
            <div>
              <span>LIVE ACTIVITY</span>

              <h2>Recent Registrations</h2>
            </div>

            <UserPlus />
          </div>

          {analytics.recentRegistrations.length === 0 ? (
            <p className="empty-state">
              No registrations yet.
            </p>
          ) : (
            analytics.recentRegistrations.map(
              (student) => (
                <div
                  className="recent-registration"
                  key={student._id}
                >
                  <div className="recent-avatar">
                    {student.name.charAt(0)}
                  </div>

                  <div>
                    <strong>{student.name}</strong>

                    <span>{student.college}</span>
                  </div>

                  <div className="source-badge">
                    {student.referralType}
                  </div>
                </div>
              )
            )
          )}
        </section>
      </section>
    </main>
  );
};

const AdminStat = ({
  icon,
  label,
  value,
  secondary,
}) => {
  return (
    <article className="admin-stat">
      <div>{icon}</div>

      <span>{label}</span>

      <strong>
        {value}
        <small>{secondary}</small>
      </strong>
    </article>
  );
};

const Channel = ({ name, value, total }) => {
  const percentage =
    total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="channel">
      <div className="channel-header">
        <span>{name}</span>
        <strong>{value}</strong>
      </div>

      <div className="channel-track">
        <div
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;