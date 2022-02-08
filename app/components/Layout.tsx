import { Link, LoaderFunction, useLoaderData } from "remix";
import { getLoggedInUser } from "~/sessions.server";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const loader = useLoaderData() || {};
  const userId = loader.user?.id;
  console.log("loader layout data", userId);

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
