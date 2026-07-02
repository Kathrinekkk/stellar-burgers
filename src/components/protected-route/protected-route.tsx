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
  // Достаем данные из нашего нового слайса
  const { isAuthChecked, user } = useSelector((state) => state.user);
  const location = useLocation();

  // Пока идет проверка (запрос к серверу при старте), показываем лоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если маршрут требует авторизации (например, профиль), а юзера нет
  if (!onlyUnAuth && !user) {
    // Перекидываем на логин, но запоминаем, куда он хотел попасть
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // Если маршрут для НЕавторизованных (логин/рега), а юзер уже есть
  if (onlyUnAuth && user) {
    // Перекидываем туда, откуда пришел, или на главную
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} />;
  }

  return element;
};
