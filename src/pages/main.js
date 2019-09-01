import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Link } from "react-router-dom";

import "./css/main.css";
import logo from "../assets/svg/logo.svg";
import like from "../assets/svg/like.svg";
import dislike from "../assets/svg/dislike.svg";
import api from "../services/api";
import itsamatch from "../assets/itsamatch.png";

export default function Main({ match: { params } }) {
  const [users, setUsers] = useState([]);
  const [userMath, setUserMath] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get("/devs", {
        headers: {
          user: params.id
        }
      });
      setUsers(response.data);
    }
    loadUsers();
  }, [params.id]);

  useEffect(() => {
    const socket = io("http://localhost:3333", {
      query: { user: params.id }
    });
    socket.on("match", dev => {
      setUserMath(dev);
    });
  }, [params.id]);

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: params.id }
    });
    setUsers(users.filter(user => user._id !== id));
  }

  async function handleDisLike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: params.id }
    });
    setUsers(users.filter(user => user._id !== id));
  }
  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <img src={user.avatar} alt={user._id} />
              <footer>
                <strong>
                  {user.name} - {user.user}
                </strong>
                <p>{user.bio}</p>
              </footer>
              <div className="buttons">
                <button type="button" onClick={() => handleDisLike(user._id)}>
                  <img src={dislike} alt="Dislike" />
                </button>
                <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={like} alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="alert">Acabou :(</p>
      )}
      {userMath && (
        <div className="container-match">
          <div className="container-match--item">
            <img className="title" src={itsamatch} alt="It's a Match" />
            <div
              className="avatar"
              style={{
                backgroundImage: `url(${userMath.avatar})`
              }}
            />
            <p className="name">{userMath.name}</p>
            <p className="bio">
              {userMath.bio}
            </p>
            <button type="button" onClick={() => setUserMath(null)}>fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
