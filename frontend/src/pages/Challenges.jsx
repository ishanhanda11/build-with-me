import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Target,
  FolderGit2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Compass,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  Code2,
  Layers,
  Award
} from "lucide-react";

import { getProjects } from "../services/project.api";
import { getProfile } from "../services/profile.api";
import { logout } from "../services/auth.api";
import LoadingAnimation from "../components/LoadingAnimation";
import "./Challenges.css";

function Challenges() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "Developer"
  );

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [projRes, profRes] = await Promise.allSettled([
          getProjects(),
          getProfile()
        ]);

        if (projRes.status === "fulfilled") {
          setProjects(projRes.value?.projects || []);
        }

        if (profRes.status === "fulfilled" && profRes.value?.data?.profile?.name) {
          setUserName(profRes.value.data.profile.name);
        }
      } catch (err) {
        console.error("Failed to load challenges data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Flatten all challenges across projects
  const allChallenges = projects.flatMap((project) =>
    (project.challenges || []).map((challenge) => ({
      ...challenge,
      projectId: project.id,
      projectName: project.title,
      projectStatus: project.status
    }))
  );

  // Active (in-progress) next challenge
  const nextActiveChallenge = allChallenges.find(
    (c) => c.status !== "COMPLETED" && c.projectStatus !== "ABANDONED"
  );

  const totalChallenges = allChallenges.length;
  const completedChallenges = allChallenges.filter(
    (c) => c.status === "COMPLETED"
  ).length;
  const inProgressChallenges = allChallenges.filter(
    (c) => c.status !== "COMPLETED" && c.projectStatus !== "ABANDONED"
  ).length;

  const filteredChallenges = allChallenges.filter((challenge) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      challenge.title.toLowerCase().includes(query) ||
      (challenge.description && challenge.description.toLowerCase().includes(query)) ||
      challenge.projectName.toLowerCase().includes(query) ||
      (challenge.learningObjectives &&
        challenge.learningObjectives.some((obj) =>
          obj.toLowerCase().includes(query)
        ));

    if (!matchesSearch) return false;

    // Status filter
    if (statusFilter === "IN_PROGRESS" && challenge.status === "COMPLETED") {
      return false;
    }
    if (statusFilter === "COMPLETED" && challenge.status !== "COMPLETED") {
      return false;
    }

    // Difficulty filter
    if (difficultyFilter !== "ALL" && challenge.difficulty !== difficultyFilter) {
      return false;
    }

    // Project filter
    if (selectedProject !== "ALL" && challenge.projectId !== selectedProject) {
      return false;
    }

    return true;
  });

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="challenges-page">
      {/* Top Navigation */}
      <header className="challenges-topnav">
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
              <Link to="/projects" className="nav-link">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/challenges" className="nav-link active">
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
              aria-expanded={dropdownOpen}
              aria-label="User menu"
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
                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item dropdown-logout-btn"
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

      {/* Main Content Area */}
      <main className="challenges-container">
        {/* Header Block */}
        <div className="challenges-header">
          <div className="challenges-header-info">
            <span className="challenges-badge">ARENA & OBJECTIVES</span>
            <h1 className="challenges-title">Coding Challenges</h1>
            <p className="challenges-subtitle">
              Browse, filter, and master individual milestones across all your technical expeditions.
            </p>
          </div>

          <div className="challenges-stats-row">
            <div className="challenge-stat-pill">
              <span className="stat-num">{totalChallenges}</span>
              <span className="stat-lbl">Total</span>
            </div>
            <div className="challenge-stat-pill">
              <span className="stat-num">{inProgressChallenges}</span>
              <span className="stat-lbl">In Progress</span>
            </div>
            <div className="challenge-stat-pill">
              <span className="stat-num stat-completed">{completedChallenges}</span>
              <span className="stat-lbl">Completed</span>
            </div>
          </div>
        </div>

        {/* Featured / Next Challenge Banner */}
        {nextActiveChallenge && (
          <div className="next-challenge-hero">
            <div className="next-hero-left">
              <div className="next-hero-badge-row">
                <span className="next-hero-tag">
                  <Sparkles size={12} />
                  <span>Next Challenge</span>
                </span>
                <span className="next-hero-project">
                  <FolderGit2 size={12} />
                  <span>{nextActiveChallenge.projectName}</span>
                </span>
                <span
                  className={`diff-pill diff-${nextActiveChallenge.difficulty.toLowerCase()}`}
                >
                  {nextActiveChallenge.difficulty}
                </span>
              </div>

              <h2 className="next-hero-title">
                {nextActiveChallenge.challengeOrder ? `Milestone #${nextActiveChallenge.challengeOrder}: ` : ""}
                {nextActiveChallenge.title}
              </h2>

              <p className="next-hero-desc">
                {nextActiveChallenge.description}
              </p>

              {nextActiveChallenge.learningObjectives?.length > 0 && (
                <div className="next-hero-objectives">
                  {nextActiveChallenge.learningObjectives.slice(0, 3).map((obj, i) => (
                    <span key={i} className="objective-chip">
                      {obj}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="next-hero-right">
              <Link
                to={`/projects/${nextActiveChallenge.projectId}/challenges/${nextActiveChallenge.id}/solve`}
                className="next-hero-btn"
              >
                <span>Solve Challenge</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* Toolbar: Search, Filters, Selectors */}
        <div className="challenges-toolbar">
          <div className="toolbar-left">
            <div className="status-filter-tabs">
              <button
                type="button"
                className={`filter-tab ${statusFilter === "ALL" ? "active" : ""}`}
                onClick={() => setStatusFilter("ALL")}
              >
                All ({totalChallenges})
              </button>
              <button
                type="button"
                className={`filter-tab ${statusFilter === "IN_PROGRESS" ? "active" : ""}`}
                onClick={() => setStatusFilter("IN_PROGRESS")}
              >
                In Progress ({inProgressChallenges})
              </button>
              <button
                type="button"
                className={`filter-tab ${statusFilter === "COMPLETED" ? "active" : ""}`}
                onClick={() => setStatusFilter("COMPLETED")}
              >
                Completed ({completedChallenges})
              </button>
            </div>

            <div className="difficulty-pills">
              {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  className={`diff-filter-btn ${difficultyFilter === diff ? "active" : ""}`}
                  onClick={() => setDifficultyFilter(diff)}
                >
                  {diff === "ALL" ? "All Levels" : diff}
                </button>
              ))}
            </div>
          </div>

          <div className="toolbar-right">
            {projects.length > 1 && (
              <div className="project-select-wrapper">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="project-filter-select"
                >
                  <option value="ALL">All Projects ({projects.length})</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="search-input-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Challenge Cards Grid */}
        {filteredChallenges.length === 0 ? (
          <div className="challenges-empty-card">
            <Target size={38} className="empty-icon" />
            <h2>No Challenges Found</h2>
            <p>
              {allChallenges.length === 0
                ? "You have not started any projects yet. Create a project to generate engineering challenges."
                : "No challenges match your current search and filter criteria."}
            </p>
            {allChallenges.length === 0 ? (
              <Link to="/projects" className="empty-action-btn">
                <span>Explore Projects</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <button
                type="button"
                className="empty-action-btn secondary"
                onClick={() => {
                  setStatusFilter("ALL");
                  setDifficultyFilter("ALL");
                  setSelectedProject("ALL");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="challenges-grid">
            {filteredChallenges.map((challenge) => {
              const isCompleted = challenge.status === "COMPLETED";
              const isAbandoned = challenge.projectStatus === "ABANDONED";

              return (
                <div key={challenge.id} className={`challenge-card ${isCompleted ? "completed" : ""}`}>
                  <div className="challenge-card-header">
                    <Link
                      to={`/projects/${challenge.projectId}`}
                      className="challenge-project-tag"
                      title={`View parent project: ${challenge.projectName}`}
                    >
                      <FolderGit2 size={12} />
                      <span>{challenge.projectName}</span>
                    </Link>

                    <div className="challenge-header-pills">
                      <span
                        className={`diff-pill diff-${challenge.difficulty.toLowerCase()}`}
                      >
                        {challenge.difficulty}
                      </span>
                      <span
                        className={`challenge-status-pill ${
                          isCompleted
                            ? "status-completed"
                            : isAbandoned
                            ? "status-abandoned"
                            : "status-progress"
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 size={11} />
                            <span>Done</span>
                          </>
                        ) : isAbandoned ? (
                          <span>Archived</span>
                        ) : (
                          <>
                            <Clock size={11} />
                            <span>In Progress</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="challenge-card-body">
                    <span className="challenge-order-label">
                      Milestone #{challenge.challengeOrder}
                    </span>
                    <h3 className="challenge-card-title">{challenge.title}</h3>
                    <p className="challenge-card-description">
                      {challenge.description}
                    </p>

                    {challenge.learningObjectives?.length > 0 && (
                      <div className="challenge-tags-row">
                        {challenge.learningObjectives.map((obj, idx) => (
                          <span key={idx} className="challenge-tag">
                            {obj}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="challenge-card-footer">
                    <Link
                      to={`/projects/${challenge.projectId}/challenges/${challenge.id}/solve`}
                      className="challenge-solve-btn"
                    >
                      <span>{isCompleted ? "Review Solution" : "Solve Challenge"}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Challenges;
