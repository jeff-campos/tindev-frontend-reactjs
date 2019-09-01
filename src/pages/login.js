import React, { useState } from "react";
import api from "../services/api";
import logo from "../assets/svg/logo.svg";
import "./css/login.css";

export default function Login({ history }) {
  const [username, setUsername] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await api.post("/devs", {
      username
    });
    const { _id } = response.data;

    history.push(`/dev/${_id}`);
  }

  return (
    <div className="content-login">
      <img src={logo} alt="Tindev" />
      <form className="form-login" onSubmit={handleSubmit}>
        <input
          placeholder="Usuário do Guithub"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button>Entrar</button>
      </form>
    </div>
  );
}
