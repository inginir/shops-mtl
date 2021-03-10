import jobsReducer from "./jobsReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  jobs: jobsReducer,
});

export default rootReducer;
