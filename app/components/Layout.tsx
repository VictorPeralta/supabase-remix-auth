import { Link } from "remix";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="remix-app">
      <header className="">
        <nav aria-label="Main navigation" className="navbar">
          <div className="container navbar-menu">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              {/* {userId ? (
                <form action="/logout" method="post">
                  <button type="submit" className="button">
                    Logout
                  </button>
                </form>
              ) : (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/signup">Sign up</Link>
                  </li>
                </>
              )} */}
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
