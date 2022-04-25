import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageType, StoreImages } from '../../types/type';

const initialState: StoreImages = {
  data: [],
  loading: false,
  error: null,
};

/* Creating a slice of the state. */
export const QuestionnaireSlice = createSlice({
  name: 'Images',
  initialState,
  reducers: {
    set_localImages: (state, action: PayloadAction<ImageType>) => {
      const storeData = async () => {
        try {
          if (state.data.length < 1) {
            state.data = [action.payload];
          } else {
            state.data = [...state.data, action.payload];
          }
          await AsyncStorage.setItem('localPictures', JSON.stringify(state));
        } catch (e) {
          console.log(e);
        }
      };
      storeData();
      return state;
    },
    deletePictureStore: (state, action: PayloadAction<string>) => {
      const newState: any = [];
      state.data.forEach((image) => {
        if (image.id === action.payload) {
          return;
        } else {
          newState.push(image);
        }
      });
      state.data = newState;
      return state;
    },
  },
});

export const { set_localImages, deletePictureStore } =
  QuestionnaireSlice.actions;

export default QuestionnaireSlice.reducer;
