import constructorReducer, {
  addIngredient,
  removeIngredient,
  clearConstructor
} from '../constructorSlice';

const mockBun = {
  _id: '1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  price: 1250,
  id: 'uuid-123'
};

const mockFilling = {
  _id: '2',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  price: 1337,
  id: 'uuid-456'
};

describe('Тестирование редьюсера burgerConstructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('должен возвращать начальное состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(constructorReducer(undefined, action)).toEqual(initialState);
  });

  it('должен обрабатывать добавление булки', () => {
    const action = { type: addIngredient.type, payload: mockBun };
    const state = constructorReducer(initialState, action);

    expect(state.bun).toEqual(mockBun);
  });

  it('должен обрабатывать добавление начинки', () => {
    const action = { type: addIngredient.type, payload: mockFilling };
    const state = constructorReducer(initialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockFilling);
  });

  it('должен обрабатывать удаление ингредиента по uniqueId', () => {
    const stateWithIngredient: any = {
      bun: null,
      ingredients: [mockFilling]
    };
    const action = { type: removeIngredient.type, payload: 'uuid-456' };
    const state = constructorReducer(stateWithIngredient, action);

    expect(state.ingredients).toHaveLength(0);
  });

  it('должен очищать конструктор при вызове clearConstructor', () => {
    const fullState: any = {
      bun: mockBun,
      ingredients: [mockFilling]
    };
    const action = { type: clearConstructor.type };
    const state = constructorReducer(fullState, action);

    expect(state).toEqual(initialState);
  });
});
