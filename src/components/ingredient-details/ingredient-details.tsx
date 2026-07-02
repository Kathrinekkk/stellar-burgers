import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  // Достаем ID ингредиента из URL
  const { id } = useParams();
  // Достаем массив всех ингредиентов из Redux
  const { ingredients } = useSelector((state) => state.ingredients);
  // Ищем нужный ингредиент по ID
  const ingredientData = ingredients.find((ing) => ing._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
