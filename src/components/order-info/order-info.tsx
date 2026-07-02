import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { useParams, useLocation } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const { number } = useParams(); // Достаем номер из URL
  const { ingredients } = useSelector((state) => state.ingredients);
  // Достаем заказы из обоих источников (лента и история)
  const feedOrders = useSelector((state) => state.feed.orders);
  const historyOrders = useSelector((state) => state.history.orders);
  const orderData = useMemo(
    () =>
      [...feedOrders, ...historyOrders].find(
        (order) => order.number === Number(number)
      ),
    [number, feedOrders, historyOrders]
  );

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
