import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock,
    Sparkles,
    Lightbulb,
    FileCode2,
    Unlock,
    ChevronDown,
    User,
    LogOut,
    RotateCcw,
    Code2,
    Send
} from "lucide-react";

import { submitSolution, getChallenge } from "../services/project.api";
import { requestHelp, getAllHelpHistory } from "../services/requestHelp.api";
import { logout } from "../services/auth.api";
import LoadingAnimation from "../components/LoadingAnimation";
import "./SolveChallenge.css";

function SolveChallenge() {
    const navigate = useNavigate();
    const { projectId, challengeId } = useParams();
    const dropdownRef = useRef(null);
    const helpEndRef = useRef(null);

    const [challenge, setChallenge] = useState(null);
    const [solution, setSolution] = useState("// Write your solution here\n\n");
    const [helpHistory, setHelpHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [requestingHelp, setRequestingHelp] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("feed");
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");

    const userName = localStorage.getItem("userName") || "Developer";

    useEffect(() => {
        const loadChallengeData = async () => {
            try {
                setLoading(true);
                const [challengeRes, historyRes] = await Promise.all([
                    getChallenge(projectId, challengeId),
                    getAllHelpHistory(challengeId)
                ]);

                if (challengeRes?.challenge) {
                    setChallenge(challengeRes.challenge);
                }
                if (historyRes?.result) {
                    setHelpHistory(historyRes.result);
                }
            } catch (error) {
                console.error("Error loading challenge workspace:", error);
                toast.error("Failed to load challenge workspace");
            } finally {
                setLoading(false);
            }
        };

        loadChallengeData();
    }, [projectId, challengeId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (helpHistory.length > 0) {
            helpEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [helpHistory.length]);

    const handleSubmit = async () => {
        if (!solution.trim()) {
            toast.error("Please write your solution before submitting");
            return;
        }

        try {
            setSubmitting(true);
            const response = await submitSolution(challengeId, solution);
            const evaluation = response.response?.evaluation;

            const historyResponse = await getAllHelpHistory(challengeId);
            setHelpHistory(historyResponse.result || []);

            if (evaluation?.logicCorrectness) {
                if (response.response?.newChallengesGenerated) {
                    toast.success("All tests passed! New challenges unlocked!");
                    setTimeout(() => {
                        navigate(`/projects/${projectId}`);
                    }, 1200);
                } else {
                    toast.success("Challenge completed successfully!");
                }
            } else {
                toast.error("Evaluation found errors. Review the AI feedback.");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRequestHelp = async (helpType) => {
        try {
            setRequestingHelp(helpType);
            await requestHelp(helpType, challengeId);
            const historyResponse = await getAllHelpHistory(challengeId);
            setHelpHistory(historyResponse.result || []);
            toast.success(`${helpType.charAt(0).toUpperCase() + helpType.slice(1)} unlocked`);
            setActiveTab("feed");
        } catch (error) {
            toast.error(error.response?.data?.error || `Failed to request ${helpType}`);
        } finally {
            setRequestingHelp(null);
        }
    };

    const handleResetCode = () => {
        setSolution(challenge?.initialCode || "// Write your solution here\n\n");
        toast("Code buffer reset");
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

    const isCompleted = challenge?.status === "COMPLETED";

    return (
        <div className="solve-page">
            <header className="solve-topnav">
                <div className="topnav-left">
                    <Link to={`/projects/${projectId}`} className="back-link">
                        <ArrowLeft size={16} />
                        <span>Project Roadmap</span>
                    </Link>

                    <div className="topnav-divider" />

                    <span className="workspace-badge">
                        <Code2 size={14} />
                        <span>Workspace</span>
                    </span>
                </div>

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

            <div className="solve-subbar">
                <div className="challenge-meta">
                    <div className="meta-main-row">
                        <span className="step-tag">
                            Milestone {challenge?.challengeOrder || 1}
                        </span>
                        <h1 className="challenge-name">{challenge?.title || "Challenge"}</h1>
                        {challenge?.difficulty && (
                            <span className="difficulty-pill">{challenge.difficulty}</span>
                        )}
                        <span
                            className={`status-pill ${isCompleted ? "pill-completed" : "pill-progress"
                                }`}
                        >
                            {isCompleted ? (
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

                    {challenge?.learningObjectives && challenge.learningObjectives.length > 0 && (
                        <div className="challenge-objectives-row">
                            {challenge.learningObjectives.map((obj, i) => (
                                <span key={i} className="objective-pill">
                                    {obj}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="subbar-actions">
                    <div className="lang-select-wrapper">
                        <select
                            className="lang-select"
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            title="Select Programming Language"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                        </select>
                    </div>
                    <button
                        type="button"
                        className="reset-btn"
                        onClick={handleResetCode}
                        title="Reset code buffer"
                    >
                        <RotateCcw size={13} />
                        <span>Reset Buffer</span>
                    </button>
                    <button
                        type="button"
                        className="submit-btn"
                        disabled={submitting}
                        onClick={handleSubmit}
                    >
                        <Send size={14} />
                        <span>{submitting ? "Evaluating..." : "Submit Solution"}</span>
                    </button>
                </div>
            </div>

            <div className="solve-workspace-layout">
                <section className="editor-pane">
                    <Editor
                        language={selectedLanguage}
                        value={solution}
                        theme="vs-dark"
                        height="100%"
                        options={{
                            fontSize: 13,
                            fontFamily: "JetBrains Mono, monospace",
                            minimap: { enabled: false },
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            wordWrap: "on",
                            padding: { top: 12, bottom: 12 },
                            automaticLayout: true
                        }}
                        onChange={(value) => setSolution(value || "")}
                    />
                </section>

                <aside className="ai-mentorship-drawer">
                    <div className="drawer-header">
                        <div className="drawer-title-row">
                            <Sparkles size={16} className="sparkle-icon" />
                            <h2>Progressive AI Mentorship</h2>
                        </div>
                        <p className="drawer-subtitle">
                            Ask for gradual clues before revealing full answers.
                        </p>
                    </div>

                    <div className="help-action-buttons">
                        <button
                            type="button"
                            className="help-btn btn-hint"
                            disabled={requestingHelp !== null || submitting}
                            onClick={() => handleRequestHelp("hint")}
                        >
                            <Lightbulb size={14} />
                            <span>{requestingHelp === "hint" ? "Requesting..." : "Hint"}</span>
                        </button>

                        <button
                            type="button"
                            className="help-btn btn-pseudo"
                            disabled={requestingHelp !== null || submitting}
                            onClick={() => handleRequestHelp("pseudocode")}
                        >
                            <FileCode2 size={14} />
                            <span>
                                {requestingHelp === "pseudocode"
                                    ? "Requesting..."
                                    : "Pseudocode"}
                            </span>
                        </button>

                        <button
                            type="button"
                            className="help-btn btn-sol"
                            disabled={requestingHelp !== null || submitting}
                            onClick={() => handleRequestHelp("solution")}
                        >
                            <Unlock size={14} />
                            <span>
                                {requestingHelp === "solution" ? "Unlocking..." : "Solution"}
                            </span>
                        </button>
                    </div>

                    <div className="help-feed-container">
                        {helpHistory.length === 0 ? (
                            <div className="empty-help-state">
                                <Lightbulb size={32} className="empty-icon" />
                                <h3>No Guidance Requested Yet</h3>
                                <p>
                                    Work through the challenge in the editor. If you encounter a block,
                                    request a non-spoiler hint to keep moving forward.
                                </p>
                            </div>
                        ) : (
                            <div className="help-feed-list">
                                {helpHistory.map((help) => (
                                    <div
                                        key={help.id}
                                        className={`help-card card-type-${help.type.toLowerCase()}`}
                                    >
                                        {help.type === "HINT" && (
                                            <div className="card-inner">
                                                <div className="card-top">
                                                    <span className="card-badge badge-hint">
                                                        <Lightbulb size={12} />
                                                        <span>Hint</span>
                                                    </span>
                                                </div>
                                                <p className="card-text">{help.content?.hint}</p>
                                            </div>
                                        )}

                                        {help.type === "PSEUDOCODE" && (
                                            <div className="card-inner">
                                                <div className="card-top">
                                                    <span className="card-badge badge-pseudo">
                                                        <FileCode2 size={12} />
                                                        <span>Pseudocode Structure</span>
                                                    </span>
                                                </div>
                                                {Array.isArray(help.content?.pseudocode) ? (
                                                    <ol className="pseudo-steps-list">
                                                        {help.content.pseudocode.map((step, index) => (
                                                            <li key={index}>{step}</li>
                                                        ))}
                                                    </ol>
                                                ) : (
                                                    <p className="card-text">{help.content?.pseudocode}</p>
                                                )}
                                            </div>
                                        )}

                                        {help.type === "SOLUTION" && (
                                            <div className="card-inner">
                                                <div className="card-top">
                                                    <span className="card-badge badge-solution">
                                                        <Unlock size={12} />
                                                        <span>AI Solution</span>
                                                    </span>
                                                </div>
                                                {help.content?.title && (
                                                    <h4 className="solution-title">
                                                        {help.content.title}
                                                    </h4>
                                                )}
                                                {help.content?.explanation && (
                                                    <p className="card-text">
                                                        {help.content.explanation}
                                                    </p>
                                                )}
                                                {help.content?.code && (
                                                    <pre className="code-display">
                                                        <code>{help.content.code}</code>
                                                    </pre>
                                                )}
                                            </div>
                                        )}

                                        {help.type === "USER_SOLUTION" && (
                                            <div className="card-inner">
                                                <div className="card-top">
                                                    <span className="card-badge badge-submission">
                                                        <Code2 size={12} />
                                                        <span>Your Submission</span>
                                                    </span>
                                                </div>
                                                <pre className="code-display">
                                                    <code>{help.content}</code>
                                                </pre>
                                            </div>
                                        )}

                                        {help.type === "EVALUATION" && (
                                            <div className="card-inner">
                                                <div className="card-top">
                                                    <span className="card-badge badge-eval">
                                                        <Sparkles size={12} />
                                                        <span>Evaluation Report</span>
                                                    </span>
                                                    <div className="eval-status-tags">
                                                        <span
                                                            className={`eval-pill ${help.content?.logicCorrectness
                                                                ? "pill-pass"
                                                                : "pill-fail"
                                                                }`}
                                                        >
                                                            {help.content?.logicCorrectness ? (
                                                                <>
                                                                    <CheckCircle2 size={11} />
                                                                    <span>Logic Passed</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle size={11} />
                                                                    <span>Logic Failed</span>
                                                                </>
                                                            )}
                                                        </span>
                                                        <span
                                                            className={`eval-pill ${help.content?.syntaxCorrectness
                                                                ? "pill-pass"
                                                                : "pill-fail"
                                                                }`}
                                                        >
                                                            {help.content?.syntaxCorrectness ? (
                                                                <>
                                                                    <CheckCircle2 size={11} />
                                                                    <span>Syntax Clean</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle size={11} />
                                                                    <span>Syntax Error</span>
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                {help.content?.feedback && (
                                                    <p className="eval-feedback">
                                                        {help.content.feedback}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={helpEndRef} />
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default SolveChallenge;