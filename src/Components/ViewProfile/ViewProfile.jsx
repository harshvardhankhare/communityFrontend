import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewProfile.css";
import toast from 'react-hot-toast';


export default function ViewProfile() {
  const { id } = useParams(); // user id from route
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/auth/users/${id}`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const startConversation = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/start",
        { receiverId: user._id },
        { withCredentials: true }
      );
      toast.success("Goint to Dm Page :)")
      navigate("/directmessage");
    } catch (err) {
      toast.error("errorr while going to convo")
      console.error("Error starting conversation", err);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="avatar">{user.username?.charAt(0).toUpperCase()}</div>
        <h2>{user.username}</h2>
        <p className="email">{user.email}</p>
        {user.bio && <p className="bio">{user.bio}</p>}

        <button className="dm-button" onClick={startConversation}>
          💬 Direct Message
        </button>
      </div>
    </div>
  );
}
