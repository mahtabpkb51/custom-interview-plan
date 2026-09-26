import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import "../style/profile.scss"

// ==========PROFILE PAGE=================
const Profile = () => {
    const navigate = useNavigate()
    const {
        user,
        handleUpdateProfile,
        handleChangePassword
    } = useAuth()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")

    const [isEditing, setIsEditing] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    // ==========PROFILE DATA=================
    useEffect(() => {
        setUsername(user?.username || "")
        setEmail(user?.email || "")
    }, [user])

    // ==========UPDATE PROFILE=================
    const handleSaveProfile = async (e) => {
        e.preventDefault()

        setMessage("")
        setError("")

        if (!username.trim() || !email.trim()) {
            setError("Username and email are required.")
            return
        }

        try {
            await handleUpdateProfile({
                username: username.trim(),
                email: email.trim()
            })

            setMessage("Profile updated successfully.")
            setIsEditing(false)
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Unable to update profile."
            )
        }
    }

    // ==========CHANGE PASSWORD=================
    const handleSavePassword = async (e) => {
        e.preventDefault()

        setMessage("")
        setError("")

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill all password fields.")
            return
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.")
            return
        }

        try {
            await handleChangePassword({
                currentPassword,
                newPassword
            })

            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
            setIsChangingPassword(false)
            setMessage("Password changed successfully.")
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Unable to change password."
            )
        }
    }

    const displayUsername = user?.username || "User"
    const displayEmail = user?.email || "Not available"

    const skills = [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "JavaScript",
        "Java"
    ]

    return (
        <div className="profile-page">

            {/* ==========PROFILE HEADER================= */}
            <div className="profile-header">
                <div>
                    <p className="profile-eyebrow">MY PROFILE</p>
                    <h1>Profile</h1>
                    <p>
                        Manage your personal information and career details.
                    </p>
                </div>

                <button
                    type="button"
                    className="profile-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Home
                </button>
            </div>

            {/* ==========PROFILE CARD================= */}
            <div className="profile-card">

                {/* ==========PROFILE TOP================= */}
                <div className="profile-card-top">
                    <div className="profile-avatar">
                        {displayUsername.charAt(0).toUpperCase()}
                    </div>

                    <div className="profile-user-info">
                        <h2>{displayUsername}</h2>
                        <p>{displayEmail}</p>
                        <span>Full Stack Developer</span>
                    </div>
                </div>

                {/* ==========PROFILE MESSAGE================= */}
                {message && (
                    <div className="profile-success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="profile-error-message">
                        {error}
                    </div>
                )}

                {/* ==========EDIT PROFILE================= */}
                {isEditing ? (
                    <form
                        className="profile-edit-form"
                        onSubmit={handleSaveProfile}
                    >
                        <h3>Edit Profile</h3>

                        <div className="profile-form-group">
                            <label htmlFor="username">
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                placeholder="Enter username"
                            />
                        </div>

                        <div className="profile-form-group">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="profile-edit-actions">
                            <button
                                type="submit"
                                className="profile-primary-button"
                            >
                                Save Changes
                            </button>

                            <button
                                type="button"
                                className="profile-secondary-button"
                                onClick={() => {
                                    setUsername(user?.username || "")
                                    setEmail(user?.email || "")
                                    setError("")
                                    setMessage("")
                                    setIsEditing(false)
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : isChangingPassword ? (
                    <form
                        className="profile-edit-form"
                        onSubmit={handleSavePassword}
                    >
                        <h3>Change Password</h3>

                        <div className="profile-form-group">
                            <label htmlFor="currentPassword">
                                Current Password
                            </label>

                            <input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="profile-form-group">
                            <label htmlFor="newPassword">
                                New Password
                            </label>

                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                placeholder="Enter new password"
                            />
                        </div>

                        <div className="profile-form-group">
                            <label htmlFor="confirmPassword">
                                Confirm New Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm new password"
                            />
                        </div>

                        <div className="profile-edit-actions">
                            <button
                                type="submit"
                                className="profile-primary-button"
                            >
                                Change Password
                            </button>

                            <button
                                type="button"
                                className="profile-secondary-button"
                                onClick={() => {
                                    setCurrentPassword("")
                                    setNewPassword("")
                                    setConfirmPassword("")
                                    setError("")
                                    setMessage("")
                                    setIsChangingPassword(false)
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        {/* ==========PERSONAL INFORMATION================= */}
                        <div className="profile-section">
                            <h3>Personal Information</h3>

                            <div className="profile-info-grid">

                                <div className="profile-info-item">
                                    <span className="profile-info-label">
                                        Username
                                    </span>

                                    <strong>{displayUsername}</strong>
                                </div>

                                <div className="profile-info-item">
                                    <span className="profile-info-label">
                                        Email
                                    </span>

                                    <strong>{displayEmail}</strong>
                                </div>

                            </div>
                        </div>

                        {/* ==========CAREER INFORMATION================= */}
                        <div className="profile-section">
                            <h3>Career Information</h3>

                            <div className="profile-career-box">
                                <div>
                                    <span>Target Role</span>
                                    <strong>Full Stack Developer</strong>
                                </div>

                                <div>
                                    <span>Experience</span>
                                    <strong>Fresher</strong>
                                </div>
                            </div>
                        </div>

                        {/* ==========TECHNICAL SKILLS================= */}
                        <div className="profile-section">
                            <h3>Technical Skills</h3>

                            <div className="profile-skills">
                                {skills.map((skill) => (
                                    <span
                                        className="profile-skill"
                                        key={skill}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ==========PROFILE ACTIONS================= */}
                        <div className="profile-actions">

                            <button
                                type="button"
                                className="profile-primary-button"
                                onClick={() => {
                                    setMessage("")
                                    setError("")
                                    setIsEditing(true)
                                }}
                            >
                                Edit Profile
                            </button>

                            <button
                                type="button"
                                className="profile-secondary-button"
                                onClick={() => {
                                    setMessage("")
                                    setError("")
                                    setIsChangingPassword(true)
                                }}
                            >
                                Change Password
                            </button>

                            <button
                                type="button"
                                className="profile-secondary-button"
                                onClick={() => navigate("/plans")}
                            >
                                View My Plans
                            </button>

                            <button
                                type="button"
                                className="profile-secondary-button"
                                onClick={() => navigate("/practice")}
                            >
                                Start Practice
                            </button>

                        </div>
                    </>
                )}

            </div>
        </div>
    )
}

export default Profile