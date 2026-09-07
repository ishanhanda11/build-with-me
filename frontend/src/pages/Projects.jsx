import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FolderGit2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Compass,
  ChevronDown,
  User,
  LogOut,
  ArrowRight,
  Ban,
  AlertTriangle,
  X
} from "lucide-react";

import { getProjects, createProject, abandonProject } from "../services/project.api";
import { getProfile } from "../services/profile.api";
import { logout } from "../services/auth.api";
import LoadingAnimation from "../components/LoadingAnimation";
import LoadingAnimation2 from "../components/loadingAnimation2";
import "./Projects.css";

function Projects() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectToAbandon, setProjectToAbandon] = useState(null);
  const [abandoning, setAbandoning] = useState(false);

  const userName = localStorage.getItem("userName") || "Developer";

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data?.projects || []);
    } catch (error) {
      if (error.response?.status === 404) {
        setProjects([]);
      } else {
        console.error("Failed to load projects:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
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

  const handleGenerateProject = async () => {
    try {
      setGenerating(true);
      const profileRes = await getProfile();
      const profile = profileRes.data?.profile;

      if (!profile) {
        toast.error("Please create your profile first");
        navigate("/profile");
        return;
      }

      const response = await createProject(profile);
      toast.success(response.message || "Project generated successfully");
      navigate(`/projects/${response.project.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to generate project");
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

  if (generating) {
    return <LoadingAnimation2 />;
  }

  if (loading) {
    return <LoadingAnimation />;
  }

  const handleOpenAbandonModal = (e, project) => {
    e.stopPropagation();
    setProjectToAbandon(project);
  };

  const handleCloseAbandonModal = () => {
    if (abandoning) return;
    setProjectToAbandon(null);
  };

  const handleConfirmAbandon = async () => {
    if (!projectToAbandon) return;
    try {
      setAbandoning(true);
      await abandonProject(projectToAbandon.id);
      toast.success(`Project "${projectToAbandon.title}" has been abandoned.`);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectToAbandon.id ? { ...p, status: "ABANDONED" } : p
        )
      );
      setProjectToAbandon(null);
    } catch (error) {
      console.error("Failed to abandon project:", error);
      toast.error(error.response?.data?.message || "Failed to abandon project");
    } finally {
      setAbandoning(false);
    }
  };

  const isProjectAbandoned = (p) => p.status === "ABANDONED";
  const isProjectDone = (p) =>
    !isProjectAbandoned(p) &&
    (p.status === "COMPLETED" ||
      (p.challenges?.length > 0 && p.challenges.every((c) => c.status === "COMPLETED")));
  const isProjectInProgress = (p) => !isProjectDone(p) && !isProjectAbandoned(p);

  const inProgressCount = projects.filter(isProjectInProgress).length;
  const completedCount = projects.filter(isProjectDone).length;
  const abandonedCount = projects.filter(isProjectAbandoned).length;

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      project.title.toLowerCase().includes(query) ||
      (project.description && project.description.toLowerCase().includes(query));

    if (!matchesSearch) return false;
    if (filter === "IN_PROGRESS") return isProjectInProgress(project);
    if (filter === "COMPLETED") return isProjectDone(project);
    if (filter === "ABANDONED") return isProjectAbandoned(project);
    return true;
  });

  return (
    <div className="projects-page">
      <header className="projects-topnav">
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
              <Link to="/challenges" className="nav-link">
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

      <main className="projects-container">
        <div className="projects-header">
          <div className="projects-header-info">
            <span className="projects-badge">EXPEDITIONS</span>
            <h1 className="projects-title">My Projects</h1>
            <p className="projects-subtitle">
              Manage your ongoing builds, milestone challenges, and development expeditions.
            </p>
          </div>

          <button
            type="button"
            className="new-project-btn"
            onClick={handleGenerateProject}
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>

        <div className="projects-toolbar">
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${filter === "ALL" ? "active" : ""}`}
              onClick={() => setFilter("ALL")}
            >
              All Projects ({projects.length})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === "IN_PROGRESS" ? "active" : ""}`}
              onClick={() => setFilter("IN_PROGRESS")}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === "COMPLETED" ? "active" : ""}`}
              onClick={() => setFilter("COMPLETED")}
            >
              Completed ({completedCount})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === "ABANDONED" ? "active" : ""}`}
              onClick={() => setFilter("ABANDONED")}
            >
              Abandoned ({abandonedCount})
            </button>
          </div>

          <div className="search-input-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="projects-empty-card">
            <Compass size={40} className="projects-empty-icon" />
            <h2>No Projects Found</h2>
            <p>
              {projects.length === 0
                ? "You haven't charted any projects yet. Generate your first project to start building."
                : "No projects matched your current search and filter criteria."}
            </p>
            {projects.length === 0 ? (
              <button
                type="button"
                className="new-project-btn"
                onClick={handleGenerateProject}
              >
                <Plus size={16} />
                <span>Generate First Project</span>
              </button>
            ) : (
              <button
                type="button"
                className="filter-clear-btn"
                onClick={() => {
                  setFilter("ALL");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            <div className="create-project-card" onClick={handleGenerateProject}>
              <div className="create-icon-wrapper">
                <Plus size={24} />
              </div>
              <h3>New Territory</h3>
              <p>Generate a new personalized project with AI challenges.</p>
            </div>

            {filteredProjects.map((project) => {
              const completedCount =
                project.challenges?.filter((c) => c.status === "COMPLETED").length || 0;
              const totalCount =
                project.challenges?.length || project.maxChallenges || 1;
              const percent = Math.round((completedCount / totalCount) * 100);
              const isAbandoned = isProjectAbandoned(project);
              const isCompleted = isProjectDone(project);
              const isInProgress = isProjectInProgress(project);

              return (
                <div
                  key={project.id}
                  className={`project-card ${isAbandoned ? "card-abandoned" : ""}`}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="project-card-top">
                    <div className="project-icon-box">
                      <FolderGit2 size={18} />
                    </div>

                    <div className="project-card-top-badges">
                      <span
                        className={`project-status-tag ${
                          isAbandoned
                            ? "status-abandoned"
                            : isCompleted
                            ? "status-completed"
                            : "status-progress"
                        }`}
                      >
                        {isAbandoned ? (
                          <>
                            <Ban size={12} />
                            <span>Abandoned</span>
                          </>
                        ) : isCompleted ? (
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

                      {isInProgress && (
                        <button
                          type="button"
                          className="project-abandon-card-btn"
                          title="Abandon this project"
                          onClick={(e) => handleOpenAbandonModal(e, project)}
                        >
                          <Ban size={12} />
                          <span>Abandon</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="project-card-title">{project.title}</h3>
                  <p className="project-card-description">
                    {project.description ||
                      "Follow the milestones and complete coding challenges to finish this project."}
                  </p>

                  <div className="project-card-progress">
                    <div className="progress-info">
                      <span>Challenges</span>
                      <span>
                        {completedCount} / {totalCount} ({percent}%)
                      </span>
                    </div>
                    <div className="progress-bar-track">
                      <div
                        className={`progress-bar-fill ${isAbandoned ? "fill-abandoned" : ""}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="project-card-footer">
                    <span className="footer-action-text">
                      {isAbandoned ? "View Archived Challenges" : "View Challenges"}
                    </span>
                    <ArrowRight size={15} className="footer-action-icon" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {projectToAbandon && (
          <div className="abandon-modal-overlay" onClick={handleCloseAbandonModal}>
            <div className="abandon-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="abandon-modal-header">
                <div className="abandon-modal-icon-box">
                  <AlertTriangle size={20} className="abandon-alert-icon" />
                </div>
                <div className="abandon-modal-title-group">
                  <h3 className="abandon-modal-title">Abandon Project</h3>
                  <p className="abandon-modal-proj-name">{projectToAbandon.title}</p>
                </div>
                <button
                  type="button"
                  className="abandon-modal-close-btn"
                  onClick={handleCloseAbandonModal}
                  disabled={abandoning}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="abandon-modal-body">
                <p>
                  Are you sure you want to abandon &ldquo;<strong>{projectToAbandon.title}</strong>&rdquo;?
                </p>
                <p className="abandon-modal-warning">
                  This project will be moved out of your active expeditions. You will not be able to submit further solutions for its challenges.
                </p>
              </div>

              <div className="abandon-modal-actions">
                <button
                  type="button"
                  className="abandon-btn-cancel"
                  onClick={handleCloseAbandonModal}
                  disabled={abandoning}
                >
                  Keep Building
                </button>
                <button
                  type="button"
                  className="abandon-btn-confirm"
                  onClick={handleConfirmAbandon}
                  disabled={abandoning}
                >
                  <Ban size={14} />
                  <span>{abandoning ? "Abandoning..." : "Yes, Abandon Project"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Projects;