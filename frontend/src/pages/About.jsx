import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Compass,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  FileCode,
  Terminal,
  Zap,
  ArrowRight,
  ChevronDown,
  Search,
  User,
  LogOut,
  Target,
  Workflow,
  HelpCircle,
  BrainCircuit,
  ShieldCheck,
  FolderGit2
} from "lucide-react";
import { getProfile } from "../services/profile.api";
import { logout } from "../services/auth.api";
import "./About.css";

function About() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const profileRes = await getProfile();
        const fetchedProfile = profileRes.data?.profile || null;
        if (fetchedProfile?.name) {
          localStorage.setItem("userName", fetchedProfile.name);
        }
        setProfile(fetchedProfile);
      } catch (err) {
        console.error("Error loading profile in About:", err);
      }
    }
    loadData();
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

  const userName = profile?.name || localStorage.getItem("userName") || "Developer";

  return (
    <div className="about-page">
      {/* Top Navigation Bar */}
      <header className="about-topnav">
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
              <Link to="/challenges" className="nav-link">
                Challenges
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link active">
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
            onClick={() => navigate("/projects")}
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

      {/* Main About Content */}
      <main className="about-main-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-badge">
            <Sparkles size={14} />
            <span>Platform Overview & Architecture</span>
          </div>
          <h1 className="about-hero-title">
            Learn by Building, Guided by Intelligence.
          </h1>
          <p className="about-hero-desc">
            Build With Me is an adaptive, hands-on engineering platform designed to eliminate
            tutorial purgatory. Build real-world production projects step by step with interactive
            coding, on-demand AI mentorship, and automated evaluation.
          </p>
          <div className="about-hero-actions">
            <Link to="/projects" className="about-btn-primary">
              <FolderGit2 size={16} />
              <span>Explore Projects</span>
            </Link>
            <Link to="/" className="about-btn-secondary">
              <Compass size={16} />
              <span>Go to Dashboard</span>
            </Link>
          </div>
        </section>

        {/* Pillars / What is this website? */}
        <section className="about-section">
          <div className="section-heading-row">
            <span className="section-tag">01 / Foundation</span>
            <h2 className="section-title">What is Build With Me?</h2>
            <p className="section-subtext">
              Most developer learning fails because watching someone else code does not build synaptic
              problem-solving pathways. Build With Me was created to put you in the driver&rsquo;s seat of genuine
              engineering systems.
            </p>
          </div>

          <div className="about-card-grid three-col">
            <div className="about-card">
              <div className="card-icon-wrap icon-crimson">
                <Code2 size={22} />
              </div>
              <h3 className="card-title">Pure Hands-On Engineering</h3>
              <p className="card-description">
                No multiple-choice questions or copy-paste snippets. You write actual source code in an integrated
                Monaco editor, tackling real architectural problems and algorithmic trade-offs.
              </p>
            </div>

            <div className="about-card">
              <div className="card-icon-wrap icon-gold">
                <BrainCircuit size={22} />
              </div>
              <h3 className="card-title">Adaptive AI Mentorship</h3>
              <p className="card-description">
                Instead of dumping answers on you, our AI mentor analyzes your specific struggle and offers graduated
                assistance—subtle nudges, pseudocode algorithms, and complete reference architectures.
              </p>
            </div>

            <div className="about-card">
              <div className="card-icon-wrap icon-emerald">
                <Layers size={22} />
              </div>
              <h3 className="card-title">Milestone-Driven Roadmaps</h3>
              <p className="card-description">
                Projects are deconstructed into sequential, bite-sized engineering challenges. Each challenge focuses on
                discrete, clear learning objectives that compound into a complete production system.
              </p>
            </div>
          </div>
        </section>

        {/* What Does It Do? */}
        <section className="about-section">
          <div className="section-heading-row">
            <span className="section-tag">02 / Capabilities</span>
            <h2 className="section-title">What Does It Do?</h2>
            <p className="section-subtext">
              From architecting customized projects to evaluating submissions in real time, Build With Me operates as
              your private engineering lead and code reviewer.
            </p>
          </div>

          <div className="features-showcase-grid">
            <div className="feature-tile">
              <div className="feature-tile-header">
                <div className="feature-tile-icon">
                  <Terminal size={18} />
                </div>
                <h4>Interactive Monaco Code Studio</h4>
              </div>
              <p>
                Powered by Monaco Editor—the engine behind VS Code. Switch effortlessly between JavaScript, Python, and
                Java with native syntax highlighting, intelligent autocompletion, and keyboard shortcuts.
              </p>
            </div>

            <div className="feature-tile">
              <div className="feature-tile-header">
                <div className="feature-tile-icon">
                  <HelpCircle size={18} />
                </div>
                <h4>Tiered Unlocking of Help</h4>
              </div>
              <p>
                Hit a roadblock? Request a gentle <strong>Hint</strong> to regain momentum, unlock <strong>Pseudocode</strong> to
                clarify the logic flow, or reveal the <strong>Solution</strong> for full architectural comparison.
              </p>
            </div>

            <div className="feature-tile">
              <div className="feature-tile-header">
                <div className="feature-tile-icon">
                  <ShieldCheck size={18} />
                </div>
                <h4>Intelligent Code Evaluation</h4>
              </div>
              <p>
                Click &ldquo;Submit Solution&rdquo; and our automated evaluation engine analyzes your code for logical
                correctness, edge cases, and runtime efficiency, giving you clear, constructive feedback.
              </p>
            </div>

            <div className="feature-tile">
              <div className="feature-tile-header">
                <div className="feature-tile-icon">
                  <Zap size={18} />
                </div>
                <h4>Dynamic Milestone Generation</h4>
              </div>
              <p>
                When you complete a series of challenges, the platform intelligently generates the next batch of adaptive
                challenges customized to your performance and skill evolution.
              </p>
            </div>

            <div className="feature-tile">
              <div className="feature-tile-header">
                <div className="feature-tile-icon">
                  <Target size={18} />
                </div>
                <h4>Learner Profile Calibration</h4>
              </div>
              <p>
                Your dashboard tailors milestones to your stated goals, target timeframes, experience level (Beginner,
                Intermediate, Advanced), learning style, and daily availability.
              </p>
            </div>

            <div className="feature-tile">
              <div className="feature-tile-header">
                <div className="feature-tile-icon">
                  <Compass size={18} />
                </div>
                <h4>Real-Time Journey Tracking</h4>
              </div>
              <p>
                Track completed challenges, total active projects, consistency streaks, and real-time help requests
                directly on your personalized dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* How Does It Work? */}
        <section className="about-section">
          <div className="section-heading-row">
            <span className="section-tag">03 / Step-by-Step Workflow</span>
            <h2 className="section-title">How Does It Work?</h2>
            <p className="section-subtext">
              A frictionless 5-step loop engineered to turn technical ambition into verified mastery.
            </p>
          </div>

          <div className="workflow-steps-container">
            <div className="workflow-step-card">
              <div className="step-number-badge">01</div>
              <div className="step-content">
                <h3 className="step-title">Calibrate Your Profile</h3>
                <p className="step-description">
                  Input your primary engineering goal, experience level, daily available hours, and learning style.
                  This ensures every project and challenge aligns precisely with your skillset.
                </p>
              </div>
            </div>

            <div className="workflow-step-card">
              <div className="step-number-badge">02</div>
              <div className="step-content">
                <h3 className="step-title">Select or Generate a Project</h3>
                <p className="step-description">
                  Browse curated project roadmaps or generate a new one. Projects define complete software systems
                  split into sequential milestone challenges.
                </p>
              </div>
            </div>

            <div className="workflow-step-card">
              <div className="step-number-badge">03</div>
              <div className="step-content">
                <h3 className="step-title">Enter the Monaco Workspace</h3>
                <p className="step-description">
                  Open a challenge to view its core objectives, description, and requirements. Write and edit code
                  directly inside the browser with your preferred programming language.
                </p>
              </div>
            </div>

            <div className="workflow-step-card">
              <div className="step-number-badge">04</div>
              <div className="step-content">
                <h3 className="step-title">Request Contextual Assistance</h3>
                <p className="step-description">
                  Whenever you need clarity, request a Hint, Pseudocode, or Solution. The assistance feed preserves your
                  previous requests so you can review reasoning patterns anytime.
                </p>
              </div>
            </div>

            <div className="workflow-step-card">
              <div className="step-number-badge">05</div>
              <div className="step-content">
                <h3 className="step-title">Submit Solution & Progress</h3>
                <p className="step-description">
                  Submit your code for automated validation. Successful submissions mark the challenge as completed,
                  update your real-time stats, and unlock the next milestone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Functions & Features Deep Dive */}
        <section className="about-section">
          <div className="section-heading-row">
            <span className="section-tag">04 / Deep Dive</span>
            <h2 className="section-title">Functions & Features Breakdown</h2>
            <p className="section-subtext">
              Built with precision across both client and server to provide a fast, focused developer experience.
            </p>
          </div>

          <div className="tech-matrix-grid">
            <div className="matrix-item">
              <div className="matrix-icon">
                <FileCode size={20} />
              </div>
              <div className="matrix-body">
                <h4>Multi-Language Code Runner</h4>
                <p>
                  Switch on the fly between JavaScript, Python, and Java. Monaco instantly updates syntax rules,
                  keywords, and editor tokenization.
                </p>
              </div>
            </div>

            <div className="matrix-item">
              <div className="matrix-icon">
                <Lightbulb size={20} />
              </div>
              <div className="matrix-body">
                <h4>Granular Help Analytics</h4>
                <p>
                  Every hint, pseudocode request, and solution reveal is tracked in real-time in the database and
                  reflected live on your dashboard statistics.
                </p>
              </div>
            </div>

            <div className="matrix-item">
              <div className="matrix-icon">
                <Workflow size={20} />
              </div>
              <div className="matrix-body">
                <h4>Adaptive Challenge Generation</h4>
                <p>
                  Integrated with state-of-the-art AI services to generate dynamic challenges that fit the exact
                  technologies and architectural milestones of your project.
                </p>
              </div>
            </div>

            <div className="matrix-item">
              <div className="matrix-icon">
                <CheckCircle2 size={20} />
              </div>
              <div className="matrix-body">
                <h4>Profile-Guarded Progression</h4>
                <p>
                  Smart authentication and profile verification ensure your workspace environment is continuously saved
                  and linked to your developer identity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer Section */}
        <section className="about-cta-card">
          <div className="cta-content">
            <h2 className="cta-title">Start Your Expedition Today</h2>
            <p className="cta-description">
              Step away from passive videos. Build authentic software, conquer engineering hurdles, and become a
              confident fullstack problem solver.
            </p>
            <div className="cta-buttons">
              <Link to="/projects" className="about-btn-primary">
                <span>View Projects</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/" className="about-btn-secondary">
                <span>Open Dashboard</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;
