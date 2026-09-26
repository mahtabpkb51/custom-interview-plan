import React from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import "../style/settings.scss"

// ==========SETTINGS PAGE=================
const Settings = () => {
    const navigate = useNavigate()
    const { user, handleLogout } = useAuth()

    const username = user?.username || "User"
    const email = user?.email || "Not available"

    // ==========LOGOUT HANDLER=================
    const handleLogoutClick = async () => {
        await handleLogout()
        navigate("/login")
    }

    return (
        <div className="settings-page">

            {/* ==========SETTINGS HEADER================= */}
            <div className="settings-header">
                <div>
                    <p className="settings-eyebrow">ACCOUNT SETTINGS</p>
                    <h1>Settings</h1>
                    <p>
                        Manage your account and application preferences.
                    </p>
                </div>

                <button
                    type="button"
                    className="settings-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Home
                </button>
            </div>

            {/* ==========SETTINGS CARD================= */}
            <div className="settings-card">

                {/* ==========ACCOUNT SETTINGS================= */}
                <div className="settings-section">
                    <div className="settings-section-header">
                        <div>
                            <h2>Account</h2>
                            <p>Your current account information.</p>
                        </div>
                    </div>

                    <div className="settings-info-grid">

                        <div className="settings-info-item">
                            <span>Username</span>
                            <strong>{username}</strong>
                        </div>

                        <div className="settings-info-item">
                            <span>Email</span>
                            <strong>{email}</strong>
                        </div>

                    </div>

                    <div className="settings-actions">

                        <button
                            type="button"
                            className="settings-primary-button"
                            onClick={() => navigate("/profile")}
                        >
                            Edit Profile
                        </button>

                        <button
                            type="button"
                            className="settings-secondary-button"
                            onClick={() => navigate("/profile")}
                        >
                            Change Password
                        </button>

                    </div>
                </div>

                {/* ==========CAREER PREFERENCES================= */}
                <div className="settings-section">
                    <div className="settings-section-header">
                        <div>
                            <h2>Career Preferences</h2>
                            <p>Your current interview preparation focus.</p>
                        </div>
                    </div>

                    <div className="settings-preference">

                        <div>
                            <span>Target Role</span>
                            <strong>Full Stack Developer</strong>
                        </div>

                        <div>
                            <span>Preparation Mode</span>
                            <strong>Interview Preparation</strong>
                        </div>

                    </div>
                </div>

                {/* ==========APPLICATION SETTINGS================= */}
                <div className="settings-section">
                    <div className="settings-section-header">
                        <div>
                            <h2>Application</h2>
                            <p>
                                Application information and preferences.
                            </p>
                        </div>
                    </div>

                    <div className="settings-option">
                        <div>
                            <strong>AI Interview Preparation</strong>
                            <p>
                                Generate interview plans, practice questions
                                and AI-powered feedback.
                            </p>
                        </div>

                        <span className="settings-status">
                            Active
                        </span>
                    </div>
                </div>

                {/* ==========ACCOUNT ACTIONS================= */}
                <div className="settings-section settings-danger">
                    <div className="settings-section-header">
                        <div>
                            <h2>Account Actions</h2>
                            <p>
                                Actions related to your current account.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="settings-logout-button"
                        onClick={handleLogoutClick}
                    >
                        Logout
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Settings