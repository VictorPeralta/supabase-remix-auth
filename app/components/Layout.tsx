import { Link, useLoaderData } from "remix";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const loader = useLoaderData() || {};
  const userId = loader.user?.id;

  return (
    <div className="remix-app">
      <header className="">
        <nav aria-label="Main navigation" className="navbar">
          <div className="container navbar-menu">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              {userId ? (
                <li>
                  <Link to="/logout">Logout</Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/signup">Sign up</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>
      <div className="">
        <div className="container">{children}</div>
      </div>
    </div>
  );
}
