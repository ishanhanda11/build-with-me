import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Compass,
    Flame,
    FolderGit2,
    Target,
    Search,
    ChevronDown,
    ArrowRight,
    LayoutDashboard,
    LogOut,
    User
} from "lucide-react";

import { getProfile } from "../services/profile.api";
import { getProjects } from "../services/project.api";
import { getHelpRequestsCount } from "../services/requestHelp.api";
import { logout } from "../services/auth.api";
import "./DashBoard.css";

function Dashboard() {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [helpRequestsCount, setHelpRequestsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        async function loadDashboardData() {
            try {
                setLoading(true);

                const profileResponse = await getProfile();
                const fetchedProfile = profileResponse.data?.profile || null;
                if (fetchedProfile?.name) {
                    localStorage.setItem("userName", fetchedProfile.name);
                }
                setProfile(fetchedProfile);

                try {
                    const projectsResponse = await getProjects();
                    setProjects(projectsResponse?.projects || []);
                } catch (projErr) {
                    if (projErr.response?.status === 404) {
                        setProjects([]);
                    } else {
                        console.error("Error fetching projects:", projErr);
                    }
                }

                try {
                    const helpCountRes = await getHelpRequestsCount();
                    setHelpRequestsCount(helpCountRes?.count ?? 0);
                } catch (helpErr) {
                    console.error("Error fetching help requests count:", helpErr);
                }
            } catch (err) {
                console.error("Error loading dashboard profile:", err);
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, []);

    const handleMouseEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
        closeTimeoutRef.current = setTimeout(() => {
            setDropdownOpen(false);
        }, 200);
    };

    const handleToggleDropdown = (e) => {
        e.stopPropagation();
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setDropdownOpen((prev) => !prev);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            navigate("/auth");
        } catch (err) {
            console.error("Logout error:", err);
            toast.error(err.response?.data?.message || "Failed to log out");
        }
    };

    const totalProjects = projects.length;

    const totalChallenges = projects.reduce(
        (sum, proj) => sum + (proj.challenges?.length || 0),
        0
    );

    const completedChallenges = projects.reduce(
        (sum, proj) =>
            sum +
            (proj.challenges?.filter((c) => c.status === "COMPLETED")?.length || 0),
        0
    );

    const activeProject =
        projects.find((proj) =>
            proj.challenges?.some((c) => c.status !== "COMPLETED")
        ) || projects[0];

    const activeProjectTotal = activeProject?.challenges?.length || 0;
    const activeProjectCompleted =
        activeProject?.challenges?.filter((c) => c.status === "COMPLETED")
            ?.length || 0;
    const activeProjectProgressPercent =
        activeProjectTotal > 0
            ? Math.round((activeProjectCompleted / activeProjectTotal) * 100)
            : 0;

    const userName = profile?.name || localStorage.getItem("userName") || "Developer";

    const streakDays = 12;
    const weeklyPips = [true, true, true, true, false, false, false];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <svg
                    className="loading-emblem"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <polygon
                        points="20,4 36,34 4,34"
                        stroke="#D8C7A5"
                        strokeWidth="1.5"
                        fill="none"
                    />
                    <polygon
                        points="20,12 30,30 10,30"
                        stroke="#A43B2E"
                        strokeWidth="1.5"
                        fill="none"
                    />
                    <line
                        x1="20"
                        y1="4"
                        x2="20"
                        y2="34"
                        stroke="#D8C7A5"
                        strokeWidth="1"
                    />
                </svg>
                <span className="loading-text">Preparing your expedition...</span>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <header className="dashboard-topnav">
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
                            <Link to="/" className="nav-link active">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/projects" className="nav-link">
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
                    <button
                        className="nav-search-btn"
                        title="Search challenges or projects"
                        aria-label="Search"
                    >
                        <Search size={18} />
                    </button>

                    <div
                        className="user-profile-wrapper"
                        ref={dropdownRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            type="button"
                            className={`user-profile-chip ${dropdownOpen ? "active" : ""}`}
                            onClick={handleToggleDropdown}
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
                            <div
                                className="profile-dropdown-menu"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
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

            <div className="dashboard-layout">
                <aside className="dashboard-sidebar">
                    <nav className="sidebar-nav">
                        <Link to="/" className="sidebar-link active">
                            <LayoutDashboard size={16} />
                            <span>Overview</span>
                        </Link>
                        <Link to="/projects" className="sidebar-link">
                            <FolderGit2 size={16} />
                            <span>Projects</span>
                        </Link>
                        <Link to="/projects" className="sidebar-link">
                            <Target size={16} />
                            <span>Challenges</span>
                        </Link>
                    </nav>

                    <div className="sidebar-quote-box">
                        <p className="sidebar-quote-text">
                            &ldquo;A small step everyday leads to something big.&rdquo;
                        </p>
                        <svg
                            className="sidebar-emblem"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                        >
                            <polygon points="12,3 21,12 12,21 3,12" />
                            <line x1="12" y1="3" x2="12" y2="21" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                        </svg>
                    </div>
                </aside>

                <main className="dashboard-main">
                    <section className="dashboard-hero">
                        <div className="hero-text-block">
                            <h1 className="hero-title">Good to see you, {userName}.</h1>
                            <p className="hero-subtitle">
                                Keep building. Progress compounds.
                            </p>
                        </div>

                        <div className="hero-art-block">
                            <svg
                                className="hero-landscape-svg"
                                viewBox="0 0 160 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0 48L24 28L48 38L80 16L112 32L140 20L160 48H0Z"
                                    fill="#1B1E1C"
                                />
                                <path
                                    d="M10 48L40 22L65 36L95 12L125 30L155 18L160 48H10Z"
                                    fill="#252A26"
                                />
                                <circle cx="95" cy="8" r="1.8" fill="#D8C7A5" />
                                <path
                                    d="M93 11L95 8.5L97 11V14H93V11Z"
                                    fill="#D8C7A5"
                                />
                            </svg>
                            <span className="hero-motto">DISCIPLINE CREATES FREEDOM.</span>
                        </div>
                    </section>

                    <div className="cards-grid">
                        <div className="dash-card">
                            <div className="card-header-row">
                                <span className="card-label">
                                    <Compass size={13} className="card-label-icon" />
                                    Your Journey
                                </span>
                            </div>

                            <div className="journey-stats-row">
                                <div className="journey-stat-col">
                                    <span className="journey-stat-value">{totalProjects}</span>
                                    <span className="journey-stat-name">Projects</span>
                                </div>
                                <div className="journey-stat-col">
                                    <span className="journey-stat-value">{totalChallenges}</span>
                                    <span className="journey-stat-name">Challenges</span>
                                </div>
                                <div className="journey-stat-col">
                                    <span className="journey-stat-value">
                                        {completedChallenges}
                                    </span>
                                    <span className="journey-stat-name">Completed</span>
                                </div>
                                <div className="journey-stat-col">
                                    <span className="journey-stat-value">{helpRequestsCount}</span>
                                    <span className="journey-stat-name">Help Requests</span>
                                </div>
                            </div>
                        </div>

                        <div className="dash-card">
                            <div className="card-header-row">
                                <span className="card-label">
                                    <Flame size={13} className="card-label-icon" />
                                    Current Streak
                                </span>
                            </div>

                            <div className="streak-card-body">
                                <div className="streak-left-block">
                                    <div className="streak-number-row">
                                        <Flame size={22} className="streak-flame-icon" />
                                        <span className="streak-value">{streakDays} Days</span>
                                    </div>

                                    <div className="streak-pips">
                                        {weeklyPips.map((isActive, idx) => (
                                            <span
                                                key={idx}
                                                className={`streak-pip ${isActive ? "active" : ""}`}
                                                title={`Day ${idx + 1}: ${isActive ? "Active" : "Upcoming"}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <blockquote className="streak-quote">
                                    &ldquo;Consistency builds what motivation can&rsquo;t.&rdquo;
                                </blockquote>
                            </div>
                        </div>

                        <div className="dash-card">
                            <div className="card-header-row">
                                <span className="card-label">
                                    <FolderGit2 size={13} className="card-label-icon" />
                                    Continue Building
                                </span>
                            </div>

                            {activeProject ? (
                                <Link
                                    to={`/projects/${activeProject.id}`}
                                    className="project-summary-box"
                                >
                                    <div className="project-woodcut-thumb">
                                        <svg
                                            width="30"
                                            height="30"
                                            viewBox="0 0 32 32"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                        >
                                            <path d="M16 28V14M16 14L8 8M16 14L24 8M16 20L10 16M16 20L22 16" />
                                            <circle cx="16" cy="6" r="2" />
                                            <line x1="6" y1="28" x2="26" y2="28" />
                                        </svg>
                                    </div>

                                    <div className="project-info-block">
                                        <h3 className="project-name">{activeProject.title}</h3>
                                        <p className="project-description">
                                            {activeProject.description ||
                                                "Continue building and advancing your technical skills."}
                                        </p>

                                        <div className="project-progress-row">
                                            <div className="project-progress-track">
                                                <div
                                                    className="project-progress-fill"
                                                    style={{ width: `${activeProjectProgressPercent}%` }}
                                                />
                                            </div>
                                            <span className="project-progress-count">
                                                {activeProjectCompleted} / {activeProjectTotal}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="project-arrow-btn">
                                        <ArrowRight size={18} />
                                    </div>
                                </Link>
                            ) : (
                                <div className="no-project-state">
                                    <p className="no-project-text">
                                        Every journey begins with a first step.
                                    </p>
                                    <Link to="/projects" className="start-project-btn">
                                        <span>+ Begin Your First Project</span>
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="dash-card">
                            <div className="card-header-row">
                                <span className="card-label">
                                    <Target size={13} className="card-label-icon" />
                                    Today&rsquo;s Quest
                                </span>
                                <span className="card-label-icon">
                                    <Compass size={14} />
                                </span>
                            </div>

                            <div className="quest-body">
                                <div className="quest-details">
                                    <div className="quest-emblem">
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <circle cx="12" cy="12" r="9" />
                                            <polygon points="12,5 14,12 12,19 10,12" fill="#B59A62" />
                                            <polygon points="5,12 12,14 19,12 12,10" fill="#B59A62" />
                                        </svg>
                                    </div>

                                    <div className="quest-title-reward">
                                        <span className="quest-objective">Complete a challenge</span>
                                        <span className="quest-xp-reward">+50 XP</span>
                                    </div>
                                </div>

                                <Link
                                    to={activeProject ? `/projects/${activeProject.id}` : "/projects"}
                                    className="quest-action-link"
                                >
                                    <span>Begin</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>

                            <p className="quest-footer-motto">
                                &ldquo;It&rsquo;s a long road, but you&rsquo;re on it.&rdquo;
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;