import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

const mockIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1250,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  }
];

describe('Тестирование редьюсера ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('должен возвращать начальное состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(ingredientsReducer(undefined, action)).toEqual(initialState);
  });

  it('должен устанавливать isLoading в true при отправке запроса (pending)', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять ингредиенты в стейт при успешном запросе (fulfilled)', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const loadingState = { ingredients: [], isLoading: true, error: null };
    const state = ingredientsReducer(loadingState, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен сохранять ошибку при неудачном запросе (rejected)', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сервера' }
    };
    const loadingState = { ingredients: [], isLoading: true, error: null };
    const state = ingredientsReducer(loadingState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сервера');
  });
});
