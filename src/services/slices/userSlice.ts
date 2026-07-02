import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  updateUserApi,
  getUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';

// Создаем Thunk для регистрации
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      // Сервер возвращает токены и данные юзера.
      // Обычно токены сохраняются внутри utils/burger-api.ts,
      // а нам здесь нужен только сам пользователь:
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Thunk для авторизации (входа)
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      // Сохраняем токены, как того требует безопасность
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Thunk для обновления данных пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Thunk для выхода из аккаунта
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken'); // Удаляем рефреш токен
      deleteCookie('accessToken'); // Удаляем токен доступа
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Thunk для проверки токена и получения данных юзера при загрузке приложения
export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  error: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка состояний регистрации
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload; // Ура, юзер зарегистрировался и попал в стейт!
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка регистрации';
      })
      // Обработка логина
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка авторизации';
      })
      // Обновление пользователя
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload; // Обновляем данные в стейте
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка обновления данных';
      })
      // Выход из профиля
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null; // Очищаем пользователя
        state.isAuthChecked = true;
      })
      // Запрос данных пользователя при инициализации
      .addCase(checkUserAuth.pending, (state) => {
        // Пока запрос идет, мы не проверены (крутится лоадер)
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload; // Ура, сервер узнал нас
        state.isAuthChecked = true; // Проверка завершена
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null; // Токен протух или его нет
        state.isAuthChecked = true; // Проверка завершена, пускаем как анонима
      });
  }
});

export const { authCheck, userLogout } = userSlice.actions;
export default userSlice.reducer;
