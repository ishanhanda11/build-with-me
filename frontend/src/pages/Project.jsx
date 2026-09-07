import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronDown,
  User,
  LogOut,
  Target,
  Award
} from "lucide-react";

import {
  getChallenges,
  getProjectById,
  generateAdaptiveChallenges
} from "../services/project.api";
import { logout } from "../services/auth.api";
import LoadingAnimation from "../components/LoadingAnimation";
import "./Project.css";

function Project() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const dropdownRef = useRef(null);

  const [project, setProject] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userName = localStorage.getItem("userName") || "Developer";

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const [challengesRes, projectRes] = await Promise.all([
          getChallenges(projectId),
          getProjectById(projectId)
        ]);

        setChallenges(challengesRes?.challenges || []);
        setProject(projectRes?.project || null);
      } catch (error) {
        console.error("Failed to load project details:", error);
        toast.error("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenerateNext = async () => {
    try {
      setGenerating(true);
      const response = await generateAdaptiveChallenges(projectId);
      if (response.challenges && response.challenges.length > 0) {
        const updated = await getChallenges(projectId);
        setChallenges(updated.challenges || []);
        toast.success("New challenges generated!");
      } else {
        toast("No new challenges needed at this stage.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to generate challenges"
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!project) {
    return (
      <div className="project-not-found">
        <h2>Project Not Found</h2>
        <p>The requested project expedition could not be located.</p>
        <Link to="/projects" className="back-btn">
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  const completedCount = challenges.filter((c) => c.status === "COMPLETED").length;
  const maxChallenges = project.maxChallenges || challenges.length || 1;
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / maxChallenges) * 100)
  );

  const isProjectCompleted =
    project.status === "COMPLETED" ||
    (challenges.length >= maxChallenges &&
      challenges.length > 0 &&
      challenges.every((c) => c.status === "COMPLETED"));

  const allCurrentCompleted =
    challenges.length > 0 && challenges.every((c) => c.status === "COMPLETED");

  const canGenerateMore =
    allCurrentCompleted &&
    challenges.length < maxChallenges &&
    project.status !== "COMPLETED";

  return (
    <div className="project-page">
      <header className="project-topnav">
        <Link to="/" className="brand-section">
          <svg
            className="brand-emblem"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <polygon points="12,2 22,20 2,20" />
            <polygon points="12,7 18,18 6,18" stroke="#A43B2E" />
            <line x1="12" y1="2" x2="12" y2="20" />
          </svg>
          <span className="brand-title">BUILD WITH ME</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/projects" className="nav-link active">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/projects" className="nav-link">
                Challenges
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <div className="user-profile-wrapper" ref={dropdownRef}>
            <button
              type="button"
              className={`user-profile-chip ${dropdownOpen ? "active" : ""}`}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <div className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{userName}</span>
              <ChevronDown
                size={14}
                className={`user-chevron ${dropdownOpen ? "rotate" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-user-header">
                  <span className="dropdown-user-greeting">Signed in as</span>
                  <span className="dropdown-user-name">{userName}</span>
                </div>
                <div className="dropdown-divider" />
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User size={15} />
                  <span>My Profile</span>
                </Link>
                <button
                  type="button"
                  className="dropdown-item dropdown-logout"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="project-container">
        <div className="project-breadcrumb">
          <Link to="/projects" className="breadcrumb-back-link">
            <ArrowLeft size={16} />
            <span>Back to Projects</span>
          </Link>
        </div>

        <section className="project-hero-card">
          <div className="project-hero-header">
            <div className="project-title-meta">
              <span className="project-meta-badge">EXPEDITION ROADMAP</span>
              <h1 className="project-headline">{project.title}</h1>
              <p className="project-subtext">
                {project.description ||
                  "Work through each challenge in sequence to complete this engineering project."}
              </p>
            </div>

            <span
              className={`project-status-pill ${
                isProjectCompleted ? "status-done" : "status-active"
              }`}
            >
              {isProjectCompleted ? (
                <>
                  <CheckCircle2 size={13} />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Clock size={13} />
                  <span>In Progress</span>
                </>
              )}
            </span>
          </div>

          <div className="project-progress-block">
            <div className="progress-labels-row">
              <span className="progress-step-text">
                {completedCount} of {maxChallenges} Challenges Completed
              </span>
              <span className="progress-percent-text">{progressPercent}%</span>
            </div>
            <div className="progress-track-bg">
              <div
                className="progress-fill-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {canGenerateMore && (
            <div className="generate-more-banner">
              <div className="banner-text">
                <strong>Phase Milestones Reached</strong>
                <span>
                  You have conquered all initial challenges. Generate the next set of adaptive challenges to continue.
                </span>
              </div>
              <button
                type="button"
                className="generate-adaptive-btn"
                disabled={generating}
                onClick={handleGenerateNext}
              >
                <Sparkles size={16} />
                <span>
                  {generating ? "Generating Challenges..." : "Generate Next Challenges"}
                </span>
              </button>
            </div>
          )}

          {isProjectCompleted && (
            <div className="project-completed-banner">
              <Award size={24} className="completion-icon" />
              <div>
                <strong>Expedition Mastered</strong>
                <p>
                  You have successfully built and completed all challenges for this project!
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="challenges-roadmap-section">
          <div className="roadmap-header">
            <div className="roadmap-title-row">
              <Target size={18} className="roadmap-icon" />
              <h2>Engineering Challenges</h2>
            </div>
            <span className="roadmap-count-badge">
              {challenges.length} {challenges.length === 1 ? "Milestone" : "Milestones"}
            </span>
          </div>

          {challenges.length === 0 ? (
            <div className="no-challenges-card">
              <p>No challenges found for this project yet.</p>
              <button
                type="button"
                className="generate-adaptive-btn"
                disabled={generating}
                onClick={handleGenerateNext}
              >
                <Sparkles size={16} />
                <span>
                  {generating ? "Generating..." : "Generate Initial Challenges"}
                </span>
              </button>
            </div>
          ) : (
            <div className="challenges-list">
              {challenges.map((challenge, index) => {
                const isChallengeCompleted = challenge.status === "COMPLETED";
                const stepNumber = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={challenge.id}
                    className={`challenge-card ${
                      isChallengeCompleted ? "challenge-completed" : ""
                    }`}
                    onClick={() =>
                      navigate(
                        `/projects/${projectId}/challenges/${challenge.id}/solve`
                      )
                    }
                  >
                    <div className="challenge-index-badge">{stepNumber}</div>

                    <div className="challenge-body">
                      <div className="challenge-header-row">
                        <h3 className="challenge-title">{challenge.title}</h3>

                        <div className="challenge-tags">
                          {challenge.difficulty && (
                            <span className="difficulty-tag">
                              {challenge.difficulty}
                            </span>
                          )}

                          <span
                            className={`challenge-status-badge ${
                              isChallengeCompleted
                                ? "badge-completed"
                                : "badge-progress"
                            }`}
                          >
                            {isChallengeCompleted ? (
                              <>
                                <CheckCircle2 size={12} />
                                <span>Completed</span>
                              </>
                            ) : (
                              <>
                                <Clock size={12} />
                                <span>In Progress</span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <p className="challenge-description">
                        {challenge.description}
                      </p>

                      {challenge.learningObjectives &&
                        challenge.learningObjectives.length > 0 && (
                          <div className="challenge-objectives">
                            <span className="objectives-title">Objectives:</span>
                            <div className="objectives-tags">
                              {challenge.learningObjectives.map((obj, i) => (
                                <span key={i} className="objective-pill">
                                  {obj}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="challenge-action-arrow">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Project;