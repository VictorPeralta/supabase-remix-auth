import React, { useState } from "react";
import { LinksFunction, useNavigate } from "remix";
import { supabase } from "~/supabase";
import stylesUrl from "../styles/auth.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

interface SignupActionData {
  emailInvalid: boolean;
  passwordInvalid: boolean;
}

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handlesignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signIn({
      email,
      password,
    });

    if (signInError) setError(signInError.message);
    else navigate("/");

    setLoading(false);
  };

  const handleClickGithubSignup = () => {
    supabase.auth.signIn({ provider: "github" });
  };

  return (
    <div>
      <p>Log in to your app</p>
      <form onSubmit={handlesignIn}>
        <label>
          Email
          <input
            name="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          Log in
        </button>
      </form>
      <button onClick={handleClickGithubSignup}>Log in with github</button>
      {error}
    </div>
  );
}
