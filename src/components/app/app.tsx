import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';
import { Preloader } from '@ui';
import '../../index.css';
import styles from './app.module.css';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const background = location.state?.background;

  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileMatch || feedMatch;

  const { ingredients, isLoading, error } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {isLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : ingredients.length > 0 ? (
        <>
          <Routes location={background || location}>
            {/* Публичные маршруты */}
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />

            {/* Маршруты для прямых ссылок (когда нет модального окна) */}
            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
            <Route
              path='/profile/orders/:number'
              element={<ProtectedRoute element={<OrderInfo />} />}
            />

            {/* Маршруты только для НЕавторизованных */}
            <Route
              path='/login'
              element={<ProtectedRoute onlyUnAuth element={<Login />} />}
            />
            <Route
              path='/register'
              element={<ProtectedRoute onlyUnAuth element={<Register />} />}
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth element={<ForgotPassword />} />
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth element={<ResetPassword />} />
              }
            />

            {/* Защищенные маршруты (только для авторизованных) */}
            <Route
              path='/profile'
              element={<ProtectedRoute element={<Profile />} />}
            />
            <Route
              path='/profile/orders'
              element={<ProtectedRoute element={<ProfileOrders />} />}
            />
            {/* Страница не найдена */}
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {/* Модальные окна */}
          {background && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal
                    title={
                      orderNumber
                        ? `#${orderNumber.padStart(6, '0')}`
                        : 'Детали заказа'
                    }
                    onClose={() => navigate(-1)}
                  >
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='ingredients/:id'
                element={
                  <Modal
                    title='Детали ингредиента'
                    onClose={() => navigate(-1)}
                  >
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute
                    element={
                      <Modal
                        title={
                          orderNumber
                            ? `#${orderNumber.padStart(6, '0')}`
                            : 'Детали заказа'
                        }
                        onClose={() => navigate(-1)}
                      >
                        <OrderInfo />
                      </Modal>
                    }
                  />
                }
              />
            </Routes>
          )}
        </>
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет ингредиентов
        </div>
      )}
    </div>
  );
};

export default App;
