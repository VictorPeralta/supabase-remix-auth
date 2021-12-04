import React, { useState } from "react";
import { LinksFunction } from "remix";
import { supabase } from "~/supabase";
import stylesUrl from "../styles/auth.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

interface SignupActionData {
  emailInvalid: boolean;
  passwordInvalid: boolean;
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signIn({
      email,
      password,
    });
    if (signUpError) setError(signUpError.message);

    setLoading(false);
  };

  const handleClickGithubSignup = () => {
    supabase.auth.signIn({ provider: "github" });
  };

  return (
    <div>
      <p>Log in to your app</p>
      <form onSubmit={handleSubmitSignup}>
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
