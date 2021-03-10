import { APPLY_TO_JOB } from "../actions/jobsActions";

export const jobsInitialState = [
  { id: "1", title: "Wirkn", description: "Fullstack engineer" },
  { id: "2", title: "Quartier des spectacles", description: "Event organizer" },
];

const jobsReducer = (state = jobsInitialState, action) => {
  switch (action.type) {
    case APPLY_TO_JOB:
      return state.map(job =>
        job.id === action.id ? { ...job, applied: true } : job
      );
    default:
      return [...state];
  }
};

export default jobsReducer;
