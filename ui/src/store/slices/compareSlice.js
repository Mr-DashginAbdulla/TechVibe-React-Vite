import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
  items: JSON.parse(localStorage.getItem('techvibe_compare')) || []
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);
      
      if (exists) {
        toast.info(product.name + " müqayisə siyahısında artıq mövcuddur.");
      } else if (state.items.length >= 4) {
        toast.warning("Maksimum 4 məhsul müqayisə edilə bilər.");
      } else {
        state.items.push(product);
        localStorage.setItem('techvibe_compare', JSON.stringify(state.items));
        toast.success(product.name + " müqayisə siyahısına əlavə edildi.");
      }
    },
    removeFromCompare: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('techvibe_compare', JSON.stringify(state.items));
      toast.success("Məhsul müqayisə siyahısından çıxarıldı.");
    },
    clearCompare: (state) => {
      state.items = [];
      localStorage.removeItem('techvibe_compare');
      toast.info("Müqayisə siyahısı təmizləndi.");
    }
  }
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;

export const selectCompareItems = (state) => state.compare.items;

export default compareSlice.reducer;
