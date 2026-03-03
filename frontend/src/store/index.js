import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from "redux";
import createSagaMiddleware from "redux-saga";
import { createBrowserHistory } from "history";
import { routerMiddleware, connectRouter } from "connected-react-router";
import saga from "../sagas/index";
import catalogReducer from "../reducers/catalogReducer";
import hitsSalesReducer from "../reducers/hitsSalesReducer";
import itemReducer from "../reducers/itemReducer";
import cartReducer from "../reducers/cartReducer";
import {
  storageCartMiddleware,
  storageCartInit,
} from "../api/apiCartLocaleStorage";

export const history = createBrowserHistory();

const rootReducer = combineReducers({
  router: connectRouter(history),
  hitsSales: hitsSalesReducer,
  catalog: catalogReducer,
  product: itemReducer,
  cart: cartReducer,
});

const sagaMiddleware = createSagaMiddleware();

// Для Redux DevTools Extension
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Опции DevTools (если нужны)
        trace: true,
        traceLimit: 25,
      })
    : compose;

const store = createStore(
  rootReducer,
  { cart: storageCartInit() },
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware,
      storageCartMiddleware
    )
  )
);

sagaMiddleware.run(saga);

export default store;