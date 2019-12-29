import fetch from 'cross-fetch'
import Cookies from 'js-cookie';

export const REQUEST_IDEAS = 'REQUEST_IDEAS'
export const RECEIVE_IDEAS = 'RECEIVE_IDEAS'

export const RECEIVE_IDEA = 'RECEIVE_IDEA'
export const RECEIVE_VERSIONS = 'RECEIVE_VERSIONS'
export const RECEIVE_VERSION_DATA = 'RECEIVE_VERSION_DATA'

export const REQUEST_META = 'REQUEST_META'
export const RECEIVE_META = 'RECEIVE_META'

export const REQUEST_SETTINGS = 'REQUEST_SETTINGS'
export const RECEIVE_SETTINGS = 'RECEIVE_SETTINGS'

export const UPDATE_SETTING_FIELD = 'UPDATE_SETTING_FIELD';


const requestIdeas = () => {
    return {
        type: REQUEST_IDEAS,
    }
};

const receiveIdeas = (json) => {
    return {
        type: RECEIVE_IDEAS,
        ideas: json,
        receivedAt: Date.now(),
    }
};

const receiveIdea = (json) => {
    return {
        type: RECEIVE_IDEA,
        idea: json,
    }
};

const receiveVersionHistory = (json, idea) => {
    return {
        type: RECEIVE_VERSIONS,
        versions: json,
        idea,
    }
};

export const fetchIdeas = () => {
    return dispatch => {
        dispatch(requestIdeas());
        return fetch('/rest/ideas/')
            .then(response => response.json())
            .then(json => dispatch(receiveIdeas(json)));
    }
};

export const fetchIdea = (idea) => {
    return dispatch => {
        return fetch(`/rest/ideas/${idea}`)
            .then(response => response.json())
            .then(json => dispatch(receiveIdea(json)));
    }
};

export const fetchVersionHistory = (idea) => {
    return dispatch => {
        return fetch(`/rest/ideas/${idea}/revisions`)
            .then(response => response.json())
            .then(json => dispatch(receiveVersionHistory(json, idea)));
    }
};

const requestMeta = () => {
    return {
        type: REQUEST_META,
    }
};

const recieveMeta = (json) => {
    return {
        type: RECEIVE_META,
        categories: json.categories,
        priorities: json.priorities,
        scopes: json.scopes,
        statuses: json.statuses,
        disciplines: json.disciplines,
        processes: json.processes,
        project_priorities: json.project_priorities,
        projects: json.projects,
        users: json.users,
        receivedAt: Date.now(),
    }
};

export const fetchMeta = () => {
    return dispatch => {
        dispatch(requestMeta());
        return fetch('/rest/meta/')
            .then(response => response.json())
            .then(json => dispatch(recieveMeta(json)));
    }
};

const requestSettings = () => {
    return {
        type: REQUEST_SETTINGS,
    }
};

const recieveSettings = (json) => {
    return {
        type: RECEIVE_SETTINGS,
        settings: json,
    }
};

export const fetchSettings = () => {
    return dispatch => {
        dispatch(requestSettings());
        return fetch('/rest/settings/')
            .then(response => response.json())
            .then(json => dispatch(recieveSettings(json)));
    }
};

export const updateSettingField = (field, checked) => {
    return {
        type: UPDATE_SETTING_FIELD,
        field,
        checked,
    }
};

export const createIdea = (idea) => {
    // filter out empty values
    const filteredData = Object.assign(...Object.entries(idea)
        .filter( ([key, value]) => value && (value.length || Object.keys(value).length || Number.isInteger(value)) )
        .map(([key, value]) => ({ [key]: idea[key] }))
    );

    const { attachments, diagrams, ...data } = filteredData;

    const filteredAttachments = attachments.filter(a => a.filepath !== "");
    const filteredDiagrams = diagrams.filter(a => a.filepath !== "");

    const csrftoken = Cookies.get('csrftoken');

    return dispatch => {
        const body = JSON.stringify(data);
        const ideaPromise = fetch(
            '/rest/ideas/',
            {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    Accept: 'application/*',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body,
            })
            .then(response => response.json()
                .then((json) => {
                    if (!response.ok) {
                        return Promise.reject(json);
                    }
                    return json;
                }),
            );
        const attachmentPromise = ideaPromise.then((json) => {
            for (const a of filteredAttachments) {
                const attachBody = new FormData();
                attachBody.append('filepath', a.file);
                attachBody.append('description', a.description);
                fetch(
                    `/rest/ideas/${json.id}/attachments/`,
                    {
                        credentials: 'same-origin',
                        method: 'POST',
                        body: attachBody,
                        headers: {
                            'X-CSRFToken': csrftoken,
                        }
                    });
            }
        });
        const diagramPromise = ideaPromise.then((json) => {
            for (const d of filteredDiagrams) {
                const attachBody = new FormData();
                attachBody.append('filepath', d.file);
                attachBody.append('description', d.description);
                fetch(
                    `/rest/ideas/${json.id}/diagrams/`,
                    {
                        credentials: 'same-origin',
                        method: 'POST',
                        body: attachBody,
                        headers: {
                            'X-CSRFToken': csrftoken,
                        }
                    });
            }
        });

        return Promise.all([ideaPromise, attachmentPromise, diagramPromise]);
    }
};

export const editIdea = (idea, id) => {
    const csrftoken = Cookies.get('csrftoken');
    // filter out empty values
    const filteredData = Object.assign(...Object.entries(idea)
        .filter( ([key, value]) => value && ((value.length || Object.keys(value).length) || Number.isInteger(value)) )
        .map(([key, value]) => ({ [key]: idea[key] }))
    );

    const { attachments, diagrams, ...data } = filteredData;

    const editedAttachments =
        attachments.filter(a => a.filepath !== "" && !a.file).map(a => {
                return { id: a.id, idea: a.idea, description: a.description };
        });

    const editedDiagrams =
        diagrams.filter(d => d.filepath !== "" && !d.file).map(d => {
                return { id: d.id, idea: d.idea, description: d.description };
        });

    data.attachments = editedAttachments;
    data.diagrams = editedDiagrams;

    return dispatch => {
        const body = JSON.stringify(data);
        const ideaPromise = fetch(
            `/rest/ideas/${id}/`,
            {
                credentials: 'same-origin',
                method: 'PUT',
                headers: {
                    Accept: 'application/*',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body,
            })
            .then(response => response.json()
                .then((json) => {
                    if (!response.ok) {
                        return Promise.reject(json);
                    }
                    return json;
                }),
            );

        const filteredAttachments = attachments.filter(a => a.file);
        const filteredDiagrams = diagrams.filter(a => a.file);

        const attachmentPromise = ideaPromise.then((json) => {
            for (const a of filteredAttachments) {
                const attachBody = new FormData();
                attachBody.append('filepath', a.file);
                attachBody.append('description', a.description);
                fetch(
                    `/rest/ideas/${json.id}/attachments/`,
                    {
                        credentials: 'same-origin',
                        method: 'POST',
                        body: attachBody,
                        headers: {
                            'X-CSRFToken': csrftoken,
                        }
                    });
            }
        });

        const diagramPromise = ideaPromise.then((json) => {
            for (const d of filteredDiagrams) {
                const attachBody = new FormData();
                attachBody.append('filepath', d.file);
                attachBody.append('description', d.description);
                fetch(
                    `/rest/ideas/${json.id}/diagrams/`,
                    {
                        credentials: 'same-origin',
                        method: 'POST',
                        body: attachBody,
                        headers: {
                            'X-CSRFToken': csrftoken,
                        }
                    });
            }
        });
        return Promise.all([ideaPromise, attachmentPromise, diagramPromise]);
    }
};

export const restoreVersion = (id, version) => {
    const csrftoken = Cookies.get('csrftoken');

    return dispatch => {
        const body = JSON.stringify({version});
        return fetch(
            `/rest/ideas/${id}/restore/`,
            {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    Accept: 'application/*',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body,
            })
            .then(response => response.json()
                .then((json) => {
                    if (!response.ok) {
                        return Promise.reject(json);
                    }
                    return dispatch(receiveIdea(json));
                }),
            );
    }
};

export const createComment = (comment, id) => {
    const csrftoken = Cookies.get('csrftoken');
    return dispatch => {
        const body = JSON.stringify(comment);
        return fetch(
            `/rest/ideas/${id}/comments/`,
            {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    Accept: 'application/*',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body,
            })
            .then(response => response.json()
                .then((json) => {
                    if (!response.ok) {
                        return Promise.reject(json);
                    }
                    return json;
                }),
            );
    }
};

