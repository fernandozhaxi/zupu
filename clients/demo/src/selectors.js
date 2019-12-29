import { createSelector } from 'reselect'

const getIdeas = (state) => state.ideas.ideas;

export const getIdeaList = createSelector(
    [ getIdeas ],
    (ideas) => {
        return Object.values(ideas);
    }
);

