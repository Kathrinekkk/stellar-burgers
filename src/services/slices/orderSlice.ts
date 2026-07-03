import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

export const placeOrder = createAsyncThunk<TOrder, string[]>(
  'order/placeOrder',
  async (data, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(data);
      return response.order as unknown as TOrder;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      });
  }
});

export const { clearOrderModal } = orderSlice.actions;
export default orderSlice.reducer;
