import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderHistory } from '../../services/slices/historySlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.history.orders);

  useEffect(() => {
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
