import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  element: React.JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  element
}: TProtectedRouteProps) => {
  const { isAuthChecked, user } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} />;
  }

  return element;
};
