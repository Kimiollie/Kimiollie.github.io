import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p>
        <Link to="/">Back to the room</Link>
      </p>
    </>
  );
}

export default NotFound;
