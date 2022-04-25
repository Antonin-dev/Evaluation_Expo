import { configureStore } from '@reduxjs/toolkit';
import Images from "../components/slice/ImagesSlice"

export const store = configureStore({
    reducer: {
        images: Images,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
