import {
    Action,
    combineReducers,
    configureStore,
    createListenerMiddleware,
    Middleware,
    ThunkAction,
} from '@reduxjs/toolkit';

import { appReducer } from './slice/AppSlice';
import { errorHandler } from '../lib/error-handler';
import { authReducer } from '@/modules/processes/auth/model/AuthSlice';


const listenerMiddleware = createListenerMiddleware();


// Middleware для обработки ошибок
const errorMiddleware: Middleware = storeAPI => next => action => {
    try {
        return next(action);
    } catch (error) {
        console.error('Redux Error:', error);
        // Обрабатываем ошибку через ErrorHandler
        errorHandler.handleAsyncError(error);
        return next(action);
    }
};



const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,


});

export const setupStore = () => {

    return configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: { getWSClient: () => null },
                },
            })
                .concat(errorMiddleware)
                .concat(listenerMiddleware.middleware),

    });
};



// Тип для extraArgument
export type ThunkExtraArgument = {
    getWSClient: () => null;
};

// Тип для thunk
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    ThunkExtraArgument,
    Action<string>
>;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppGetState = AppStore['getState'];

export const store = setupStore();

//@ts-ignore
// window.eventStore = store;
