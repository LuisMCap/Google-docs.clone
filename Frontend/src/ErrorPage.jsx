import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  return <div>{error.statusText}</div>;
}

export default ErrorPage;
