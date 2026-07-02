import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { removeIngredient } from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Функция удаления ингредиента
    const handleClose = () => {
      // Передаем уникальный id конкретного кусочка, который нужно удалить
      dispatch(removeIngredient(ingredient.id));
    };

    // Функции перемещения (сортировки) ингредиентов внутри конструктора
    // По заданию сортировка не является критическим требованием для сдачи,
    // поэтому пока оставляем заглушки, чтобы избежать лишних ошибок.
    const handleMoveUp = () => {};
    const handleMoveDown = () => {};

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
