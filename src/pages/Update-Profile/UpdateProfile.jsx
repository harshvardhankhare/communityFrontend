import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiLoader, FiArrowLeft, FiGithub, FiTwitter, FiLinkedin, FiMail, FiMapPin, FiUser } from 'react-icons/fi';
import './UpdateProfile.css'; // Import the CSS file

const UpdateProfile = () => {
    const [profile, setProfile] = useState({
        name: '',
        bio: '',
        email: '',
        github: '',
        twitter: '',
        linkedin: '',
        location: '',
        avatar: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5000/auth/me', {
                    withCredentials: true,
                });
                setProfile({
                    name: res.data.name || '',
                    bio: res.data.bio || '',

                    github: res.data.github || '',
                    twitter: res.data.twitter || '',
                    linkedin: res.data.linkedin || '',
                    location: res.data.location || '',
                });
            } catch (err) {
                console.error(err);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('http://localhost:5000/auth/profile', profile, {
                withCredentials: true,
            });
            navigate('/profile');
        } catch (err) {
            console.error('Failed to update profile', err);
            alert('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="update-profile-container">
            <div className="profile-header">
                <button
                    onClick={() => navigate(-1)}
                    className="back-button"
                >
                    <FiArrowLeft className="icon" /> Back
                </button>
                <h2>Update Profile</h2>
            </div>

            <div className="profile-card">
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label htmlFor="name">
                                <FiUser className="icon" /> Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={profile.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                            />
                        </div>


                        <div className="form-group full-width">
                            <label htmlFor="avatar">
                                <FiUser className="icon" /> Img Url
                            </label>
                            <input
                                id="avatar"
                                name="avatar"
                                type="text"
                                value={profile.avatar}
                                onChange={handleChange}
                                placeholder="Your img link"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="bio">Bio</label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={4}
                                value={profile.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                            />
                        </div>



                        <div className="form-group">
                            <label htmlFor="location">
                                <FiMapPin className="icon" /> Location
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={profile.location}
                                onChange={handleChange}
                                placeholder="City, Country"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="github">
                                <FiGithub className="icon" /> GitHub
                            </label>
                            <div className="input-with-prefix">
                                <span>github.com/</span>
                                <input
                                    id="github"
                                    name="github"
                                    type="text"
                                    value={profile.github}
                                    onChange={handleChange}
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="twitter">
                                <FiTwitter className="icon" /> Twitter
                            </label>
                            <div className="input-with-prefix">
                                <span>twitter.com/</span>
                                <input
                                    id="twitter"
                                    name="twitter"
                                    type="text"
                                    value={profile.twitter}
                                    onChange={handleChange}
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="linkedin">
                                <FiLinkedin className="icon" /> LinkedIn
                            </label>
                            <div className="input-with-prefix">
                                <span>linkedin.com/in/</span>
                                <input
                                    id="linkedin"
                                    name="linkedin"
                                    type="text"
                                    value={profile.linkedin}
                                    onChange={handleChange}
                                    placeholder="username"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="submit-button"
                        >
                            {saving ? (
                                <>
                                    <FiLoader className="icon spinning" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiSave className="icon" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;