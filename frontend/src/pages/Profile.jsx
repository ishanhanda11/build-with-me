import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    AlertCircle,
    Edit3,
    Check,
    X,
    Award,
    Flame,
    Shield,
    Compass,
    Calendar
} from "lucide-react";

import { createProfile, getProfile, updateProfile } from "../services/profile.api";
import { getMe } from "../services/auth.api";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();
    const dateInputRef = useRef(null);

    const handleOpenCalendar = () => {
        if (dateInputRef.current) {
            if (typeof dateInputRef.current.showPicker === "function") {
                try {
                    dateInputRef.current.showPicker();
                } catch (err) {
                    dateInputRef.current.focus();
                }
            } else {
                dateInputRef.current.focus();
            }
        }
    };

    const initialStoredName = localStorage.getItem("userName");
    const safeInitialName = (initialStoredName && initialStoredName !== "Developer")
        ? initialStoredName
        : "";

    const [profile, setProfile] = useState({
        name: safeInitialName,
        goal: "",
        targetTimeFrame: "",
        experienceLevel: "BEGINNER",
        difficulty: "ADAPTIVE",
        helpPreference: "ADAPTIVE",
        learningStyle: "MIXED",
        availableHoursPerDay: 2
    });

    const [profileExists, setProfileExists] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);

                let currentUserName = "";
                try {
                    const meRes = await getMe();
                    if (meRes.data?.user?.name) {
                        currentUserName = meRes.data.user.name;
                        localStorage.setItem("userName", currentUserName);
                    }
                } catch (meErr) {
                    console.log("Could not fetch user details from /auth/me:", meErr);
                }

                const response = await getProfile();

                if (response.data?.profile) {
                    const data = response.data.profile;
                    const resolvedName =
                        currentUserName ||
                        (data.name && data.name !== "Developer" ? data.name : "") ||
                        (localStorage.getItem("userName") && localStorage.getItem("userName") !== "Developer"
                            ? localStorage.getItem("userName")
                            : "Builder");

                    if (resolvedName && resolvedName !== "Developer") {
                        localStorage.setItem("userName", resolvedName);
                    }

                    setProfile({
                        ...data,
                        name: resolvedName,
                        targetTimeFrame: data.targetTimeFrame
                            ? data.targetTimeFrame.split("T")[0]
                            : ""
                    });
                    setProfileExists(true);
                    setIsEditing(false);
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    setProfileExists(false);
                    setIsEditing(true);
                } else {
                    toast.error(error.response?.data?.message || "Failed to load profile");
                }
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profile.goal.trim()) {
            toast.error("Please enter your learning goal");
            return;
        }

        try {
            setSaving(true);
            let response;

            if (profileExists) {
                response = await updateProfile(profile);
                toast.success(response.data?.message || "Profile updated successfully");
                setIsEditing(false);
            } else {
                response = await createProfile(profile);
                toast.success("Profile created! You can now generate projects and challenges.");
                setProfileExists(true);
                setIsEditing(false);

                setTimeout(() => {
                    navigate("/");
                }, 1200);
            }
        } catch (error) {
            console.error("Profile save error:", error);
            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to save profile"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="dashboard-loading">
                    <svg
                        className="loading-emblem"
                        width="36"
                        height="36"
                        viewBox="0 0 40 40"
                        fill="none"
                    >
                        <polygon points="20,4 36,34 4,34" stroke="#D8C7A5" strokeWidth="1.5" />
                        <polygon points="20,12 30,30 10,30" stroke="#A43B2E" strokeWidth="1.5" />
                    </svg>
                    <span className="loading-text">Loading profile dossier...</span>
                </div>
            </div>
        );
    }

    const storedName = localStorage.getItem("userName");
    const userName = (profile.name && profile.name !== "Developer")
        ? profile.name
        : (storedName && storedName !== "Developer")
        ? storedName
        : "Builder";
    const userInitial = userName.trim() ? userName.trim().charAt(0).toUpperCase() : "B";

    return (
        <div className="profile-page">
            <header className="profile-topnav">
                <Link to="/" className="profile-back-link">
                    <ArrowLeft size={16} />
                    <span>Back to Dashboard</span>
                </Link>

                <div className="brand-section">
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
                </div>

                <div style={{ width: 100 }} />
            </header>

            <main className="profile-container">
                {!profileExists && (
                    <div className="profile-warning-banner">
                        <div className="warning-icon-box">
                            <AlertCircle size={20} />
                        </div>
                        <div className="warning-text-content">
                            <h3 className="warning-title">Profile Required Before Departure</h3>
                            <p className="warning-description">
                                Create your learning profile below first. Your goals, experience level, and
                                learning style are used by the AI engine to generate customized projects and
                                engineering challenges tailored to your pace.
                            </p>
                        </div>
                    </div>
                )}

                <div className="profile-layout-grid">
                    <aside className="profile-identity-card">
                        <div className="profile-avatar-large">
                            {userInitial}
                        </div>

                        <h2 className="profile-user-name">{userName}</h2>
                        <span className="profile-badge-title">
                            {profile.experienceLevel} BUILDER
                        </span>

                        <div className="profile-xp-section">
                            <div className="xp-track">
                                <div className="xp-fill" style={{ width: "0%" }} />
                            </div>
                            <div className="xp-labels">
                                <span>Progression</span>
                                <span>0 / 700 XP</span>
                            </div>
                        </div>

                        <blockquote className="profile-quote-card">
                            &ldquo;A better developer than yesterday.&rdquo;
                        </blockquote>

                        <div className="profile-badges-block">
                            <span className="badges-header-label">Earned Emblems</span>
                            <div className="badges-grid">
                                <div className="badge-item">
                                    <Compass size={18} />
                                    <span className="badge-name">First Step</span>
                                </div>
                                <div className="badge-item">
                                    <Flame size={18} />
                                    <span className="badge-name">Streak 7</span>
                                </div>
                                <div className="badge-item">
                                    <Shield size={18} />
                                    <span className="badge-name">Pioneer</span>
                                </div>
                                <div className="badge-item">
                                    <Award size={18} />
                                    <span className="badge-name">Builder</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <section className="profile-form-card">
                        <div className="form-card-header">
                            <div className="form-header-text">
                                <h2>Learning Dossier</h2>
                                <p>
                                    {profileExists
                                        ? "Your engineering goals and AI challenge parameters."
                                        : "Set your goals and learning preferences to begin."}
                                </p>
                            </div>

                            {profileExists && (
                                <div className="form-actions-top">
                                    {!isEditing ? (
                                        <button
                                            type="button"
                                            className="edit-toggle-btn"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <Edit3 size={14} />
                                            <span>Edit Profile</span>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="edit-toggle-btn"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            <X size={14} />
                                            <span>Cancel</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="profile-field">
                                <label className="field-label" htmlFor="goal">
                                    Primary Goal or Target Role
                                </label>
                                <textarea
                                    id="goal"
                                    className="field-textarea"
                                    placeholder="e.g. Master full-stack web development and build production-ready distributed systems"
                                    value={profile.goal}
                                    onChange={(e) =>
                                        setProfile({ ...profile, goal: e.target.value })
                                    }
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div className="form-row-2col">
                                <div className="profile-field">
                                    <label className="field-label" htmlFor="targetTimeFrame">
                                        Target Completion Date
                                    </label>
                                    <div className="date-input-wrapper">
                                        <input
                                            ref={dateInputRef}
                                            id="targetTimeFrame"
                                            type="date"
                                            className="field-input"
                                            value={profile.targetTimeFrame}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    targetTimeFrame: e.target.value
                                                })
                                            }
                                            disabled={!isEditing}
                                            onClick={() => {
                                                if (isEditing && dateInputRef.current?.showPicker) {
                                                    try {
                                                        dateInputRef.current.showPicker();
                                                    } catch (err) {}
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="date-calendar-btn"
                                            onClick={handleOpenCalendar}
                                            disabled={!isEditing}
                                            title="Open calendar picker"
                                            aria-label="Open calendar picker"
                                        >
                                            <Calendar size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="profile-field">
                                    <label className="field-label" htmlFor="availableHoursPerDay">
                                        Available Hours Per Day
                                    </label>
                                    <input
                                        id="availableHoursPerDay"
                                        type="number"
                                        min="1"
                                        max="16"
                                        className="field-input"
                                        value={profile.availableHoursPerDay}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                availableHoursPerDay: Number(e.target.value)
                                            })
                                        }
                                        disabled={!isEditing}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row-2col">
                                <div className="profile-field">
                                    <label className="field-label" htmlFor="experienceLevel">
                                        Experience Level
                                    </label>
                                    <select
                                        id="experienceLevel"
                                        className="field-select"
                                        value={profile.experienceLevel}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                experienceLevel: e.target.value
                                            })
                                        }
                                        disabled={!isEditing}
                                    >
                                        <option value="BEGINNER">Beginner (Freshers / Foundational)</option>
                                        <option value="INTERMEDIATE">Intermediate (Independent Builder)</option>
                                        <option value="ADVANCED">Advanced (Leads Complex Systems)</option>
                                        <option value="EXPERT">Expert (Architectural Vision)</option>
                                    </select>
                                </div>

                                <div className="profile-field">
                                    <label className="field-label" htmlFor="difficulty">
                                        Challenge Difficulty
                                    </label>
                                    <select
                                        id="difficulty"
                                        className="field-select"
                                        value={profile.difficulty}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                difficulty: e.target.value
                                            })
                                        }
                                        disabled={!isEditing}
                                    >
                                        <option value="ADAPTIVE">Adaptive (Scales with performance)</option>
                                        <option value="EASY">Easy</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HARD">Hard</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row-2col">
                                <div className="profile-field">
                                    <label className="field-label" htmlFor="helpPreference">
                                        Assistance Preference
                                    </label>
                                    <select
                                        id="helpPreference"
                                        className="field-select"
                                        value={profile.helpPreference}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                helpPreference: e.target.value
                                            })
                                        }
                                        disabled={!isEditing}
                                    >
                                        <option value="ADAPTIVE">Adaptive</option>
                                        <option value="HINT_FIRST">Hint First</option>
                                        <option value="PSEUDOCODE_FIRST">Pseudocode First</option>
                                        <option value="SOLUTION_LAST">Solution Last</option>
                                    </select>
                                </div>

                                <div className="profile-field">
                                    <label className="field-label" htmlFor="learningStyle">
                                        Preferred Learning Style
                                    </label>
                                    <select
                                        id="learningStyle"
                                        className="field-select"
                                        value={profile.learningStyle}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                learningStyle: e.target.value
                                            })
                                        }
                                        disabled={!isEditing}
                                    >
                                        <option value="MIXED">Mixed (Balanced theory and building)</option>
                                        <option value="HANDS_ON">Hands On (Code first)</option>
                                        <option value="VISUAL">Visual (Architecture diagrams)</option>
                                        <option value="THEORY">Theory (Concepts first)</option>
                                    </select>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="form-submit-row">
                                    <button
                                        type="submit"
                                        className="profile-save-btn"
                                        disabled={saving}
                                    >
                                        <Check size={16} />
                                        <span>
                                            {saving
                                                ? "Saving Profile..."
                                                : profileExists
                                                ? "Save Changes"
                                                : "Create Profile & Begin Journey"}
                                        </span>
                                    </button>

                                    {profileExists && (
                                        <button
                                            type="button"
                                            className="profile-cancel-btn"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            )}
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Profile;