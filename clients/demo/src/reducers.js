import { combineReducers } from 'redux'
import {reducer as notifications} from 'react-notification-system-redux';
import _ from 'lodash';
import {
    REQUEST_IDEAS,
    RECEIVE_IDEAS,
    RECEIVE_IDEA,
    RECEIVE_VERSIONS,
    RECEIVE_VERSION_DATA,
    REQUEST_META,
    RECEIVE_META,
    REQUEST_SETTINGS,
    RECEIVE_SETTINGS,
    UPDATE_SETTING_FIELD,
} from './actions';



const ideas = (
    state = {
        isFetching: true,
        ideas: {},
        versions: {},
        versionData: {},
    },
    action,
) => {
    switch (action.type) {
    case REQUEST_IDEAS:
        return Object.assign({}, state, {
            isFetching: true,
        })
    case RECEIVE_IDEAS: {
        const ideas = action.ideas.reduce((obj, idea) => {
            obj[idea.id] = idea
            return obj
        }, {})
        return Object.assign({}, state, {
            isFetching: false,
            ideas,
            lastUpdated: action.receivedAt
        })
    }
    case RECEIVE_IDEA: {
        const idea = action.idea;
        const ideas = { ...state.ideas, [idea.id]: idea }
        return Object.assign({}, state, {
            ideas,
        })
    }
    case RECEIVE_VERSIONS: {
        const versions = { ...state.versions, [action.idea]: action.versions }
        return Object.assign({}, state, {
            versions,
        })
    }
    case RECEIVE_VERSION_DATA: {
        const versions = { ...state.versionData, [action.idea]: { [action.version]: action.data } }
        return Object.assign({}, state, {
            versions,
        })
    }
    default:
        return state
    }
};

const byKey = (array, keyBy, valueKey) => {
	return array.reduce((obj, item) => {
        obj[item[keyBy]] = item[valueKey];
        return obj;
	}, {});
};

const meta = (
    state = {
        isFetching: true,
        categories: {},
        priorities: {},
        scopes: {},
        statuses: {},
        disciplines: {},
        processes: {},
        project_priorities: {},
        users: [],
        projects: {},
    },
    action,
) => {
    switch (action.type) {
    case REQUEST_META:
        return Object.assign({}, state, {
            isFetching: true,
        })
    case RECEIVE_META:
        return Object.assign({}, state, {
            isFetching: false,
            categories: byKey(action.categories, 'id', 'category'),
            priorities: byKey(action.priorities, 'id', 'priority'),
            scopes: byKey(action.scopes, 'id', 'scope'),
            statuses: byKey(action.statuses, 'id', 'status'),
            disciplines: byKey(action.disciplines, 'id', 'discipline'),
            processes: byKey(action.processes, 'id', 'process'),
            project_priorities: _.keyBy(action.project_priorities, 'id'),
            users: action.users,
            users_by_id: _.keyBy(action.users, 'username'),
            projects: byKey(action.projects, 'id', 'project'),
            lastUpdated: action.receivedAt
        })
    default:
        return state
    }

};

const settings = (
    state = {
        settings: ['discipline'],
        isFetching: true,
    },
    action,
) => {
    switch (action.type) {
    case REQUEST_SETTINGS:
        return Object.assign({}, state, {
            isFetching: true,
        })
    case RECEIVE_SETTINGS:
        return Object.assign({}, state, {
            isFetching: false,
            settings: action.settings
        })
    case UPDATE_SETTING_FIELD: {
        const fields = state.settings;
        let newFields;
        if (action.checked) {
            newFields = fields.concat(action.field);
        } else {
            newFields = fields.filter(f => f !== action.field);
        }
        return {...state,
            settings: newFields
        }
    }
    default:
        return state
    }

};

const rootReducer = combineReducers({
    ideas,
    meta,
    settings,
    notifications,
});

export default rootReducer;

