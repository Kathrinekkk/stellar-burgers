import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export const fetchOrderHistory = createAsyncThunk(
  'history/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

type THistoryState = {
  orders: TOrder[];
  isLoading: boolean;
};

const initialState: THistoryState = {
  orders: [],
  isLoading: false
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      });
  }
});

export default historySlice.reducer;
