import constructorReducer, {
  addIngredient,
  removeIngredient,
  clearConstructor
} from '../constructorSlice';

const mockBun = {
  _id: '1',
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
};

const mockFilling = {
  _id: '2',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'https://code.s3.yandex.net/react/code/meat-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png'
};

describe('Тестирование редьюсера burgerConstructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('должен возвращать начальное состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(constructorReducer(undefined, action as any)).toEqual(initialState);
  });

  it('должен обрабатывать добавление булки', () => {
    const action = addIngredient(mockBun);
    const state = constructorReducer(initialState, action);

    expect(state.bun).toEqual({ ...mockBun, id: expect.any(String) });
  });

  it('должен обрабатывать добавление начинки', () => {
    const action = addIngredient(mockFilling);
    const state = constructorReducer(initialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({ ...mockFilling, id: expect.any(String) });
  });

  it('должен обрабатывать удаление ингредиента', () => {
    const stateWithIngredient: any = {
      bun: null,
      ingredients: [{ ...mockFilling, id: 'uuid-456' }]
    };
    
    const action = removeIngredient('uuid-456');
    const state = constructorReducer(stateWithIngredient, action);

    expect(state.ingredients).toHaveLength(0);
  });

  it('должен очищать конструктор при вызове clearConstructor', () => {
    const fullState: any = {
      bun: { ...mockBun, id: 'uuid-123' },
      ingredients: [{ ...mockFilling, id: 'uuid-456' }]
    };
    const action = clearConstructor();
    const state = constructorReducer(fullState, action);

    expect(state).toEqual(initialState);
  });
});
