import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container-page grid min-h-[60vh] place-items-center text-center">
    <div>
      <p className="font-display text-6xl font-bold text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-navy-900">Page not found</h1>
      <p className="mt-2 text-steel">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
