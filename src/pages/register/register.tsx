import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  // Локальные стейты для полей формы
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Достаем ошибку из стора, если сервер нас отругает (например, юзер уже существует)
  const { error } = useSelector((state) => state.user);

  // Функция, которая сработает при нажатии на кнопку «Зарегистрироваться»
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault(); // Останавливаем перезагрузку страницы браузером
    // Диспатчим наш Thunk с данными из полей
    dispatch(registerUser({ name: userName, email, password }))
      .unwrap() // Позволяет поймать успешное выполнение
      .then(() => {
        // Если запрос прошел успешно — перекидываем на главную
        navigate('/');
      })
      .catch((err) => {
        console.error('Ошибка при регистрации:', err);
      });
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
