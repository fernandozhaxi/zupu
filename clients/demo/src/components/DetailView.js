import React, { Component } from "react";
import { connect } from 'react-redux';
import moment from 'moment';

import { Col, Container, Row, Button, Form } from 'reactstrap';

import FormField from "./FormField";
import AttachmentField from "./AttachmentField";
import Crumbs from './Crumbs';
import CommentThread from './Comments';
import { fetchMeta, createIdea, editIdea, fetchIdeas, fetchVersionHistory } from '../actions';
import { REQUIRED_FIELDS, MODE} from '../consts';
import { USER_IS_CIPH} from '../permissions';


const USER_FIELDS = [ "owner", "proposer", "reviewers", "dm_sponsor" ]

class DetailView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            form: {
                projects: [],
                category: "",
                priority: "",
                discipline: "",
                scope: "",
                process_nodes: "",
                status: "",
                reviewers: [],
                dm_sponsor: "",
                owner: "",
                proposer: djangoUsername,
                name: "",
                _type: "",
                summary: "",
                motivation: "",
                status_comment: "",
                resources: "",
                link_page: "",
                start_date: "",
                requirement_review: "",
                complete_date: "",
                date_added: "",
                external_link: "",
                description: "",
                attachments: [{filepath: "", description: ""}],
                diagrams: [{filepath: "", description: ""}],
            },
        };
    }

    static getMode(location) {
        if (location.pathname.includes("view")) {
            return MODE.VIEW
        } else if (location.pathname.includes("new")) {
            return MODE.NEW
        } else if (location.pathname.includes("edit")) {
            return MODE.EDIT
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // set the state after getting props

        const mode = DetailView.getMode(nextProps.location);
        if (prevState.form.priority === "" && Object.keys(nextProps.meta.priorities).length !== 0) {
            if (mode === MODE.NEW) {
                const projects = [
                    {
                        project: parseInt(Object.keys(nextProps.meta.projects)[0]),
                        priority: parseInt(Object.keys(nextProps.meta.project_priorities)[0]),
                    }
                ];
                const state = {
                    ...prevState,
                    form: {
                        ...prevState.form,
                        priority: parseInt(Object.keys(nextProps.meta.priorities)[0]),
                        category: parseInt(Object.keys(nextProps.meta.categories)[0]),
                        scope: parseInt(Object.keys(nextProps.meta.scopes)[0]),
                        status: parseInt(Object.keys(nextProps.meta.statuses)[0]),
                        discipline: parseInt(Object.keys(nextProps.meta.disciplines)[0]),
                        process_nodes: parseInt(Object.keys(nextProps.meta.processes)[0]),
                        projects,
                    }
                }
                return state;
            }
            else if(mode === MODE.EDIT) {
                const idea = nextProps.idea;
                // filter out empty values
                if (idea) {
                    const data = Object.assign(...Object.entries(idea)
                        .filter( ([key, value]) => value && (value.length || Object.keys(value).length || Number.isInteger(value)) )
                        .map(([key, value]) => ({ [key]: idea[key] }))
                    );
                    return {
                        ...prevState,
                        form: {
                            ...prevState.form,
                            ...data,
                        }
                    }
                }
            }
        }
        return prevState;
    }

    componentDidMount() {
        this.props.fetchMeta();
        this.props.fetchIdeas();
        const id = this.props.match.params.id;
        const mode = DetailView.getMode(this.props.location);
        if (mode !== MODE.NEW) {
            this.props.fetchVersionHistory(id);
        }
    }

    onChange = (field, subField, index) => (e) => {
        let value;
        if (USER_FIELDS.includes(field)) {
            if (Array.isArray(e)) {
                value = e.map(u => u.username);
            } else {
                value = e;
            }
        } else if(field === "projects") {
            value = [...this.state.form.projects];
            if (subField === "project") {
                if (e) {
                    value[index][subField] = e;
                }
            } else {
                value[index][subField] = e.target.value;
            }
        } else if(field === "attachments") {
            value = [...this.state.form.attachments];
            value[index][subField] = e.target.value;
            if (e.target.files) {
                value[index].file = e.target.files[0];
            }
        } else if(field === "diagrams") {
            value = [...this.state.form.diagrams];
            value[index][subField] = e.target.value;
            if (e.target.files) {
                value[index].file = e.target.files[0];
            }
        } else if (field === "description") {
            value = e.target.getContent()
        } else {
            value = e.target.value;
        }
        this.setState({
            form: {
                ...this.state.form,
                [field]: value,
            },
            errors: {
                ...this.state.errors,
                [field]: "",
            }
        });
    }

    submit = (e) => {
        e.stopPropagation();
        const errors = {}
        REQUIRED_FIELDS.forEach((f) => {
            const val = this.state.form[f];
            if (!val || (Array.isArray(val) && val.length === 0) ) {
                errors[f] = "This is a required field";
            }
        });

        if (Object.keys(errors).length !== 0) {
            this.setState({errors});
        } else {
            // fix for creatable projects
            const projects = this.state.form.projects.map(p => ({
                priority: p.priority,
                project: typeof p.project === "number" ? p.project : p.project.value
            }));
            const form = {
                ...this.state.form,
                projects,
            };

            const mode = DetailView.getMode(this.props.location);
            if (mode === MODE.NEW) {
                this.props.createIdea(form)
                    .then(json => this.props.history.push(`/view/${json[0].id}`));
            }
            else if(mode === MODE.EDIT) {
                const id = this.props.idea.id;

                this.props.editIdea(form, this.props.idea.id)
                    .then(() => this.props.history.push(`/view/${id}`));
            }
        }
    }

    addProject = () => {
        const project = {
            project: Object.keys(this.props.meta.projects)[0],
            priority: Object.keys(this.props.meta.project_priorities)[0],
        };
        this.setState({
            form: {
                ...this.state.form,
                projects: [...this.state.form.projects, project],
            }
        });
    }

    addFile = (field) => () => {
        const data = { filepath: "", description: "" }
        this.setState({
            form: {
                ...this.state.form,
                [field]: [...this.state.form[field], data],
            }
        });
    }

    removeFile = (field, index) => () => {
        if (index > 0) {
            const data = [
              ...this.state.form[field].slice(0, index),
              ...this.state.form[field].slice(index + 1)
            ];
            this.setState({
                form: {
                    ...this.state.form,
                    [field]: data,
                }
            });
        } else {
            const empty = { filepath: "", description: "" }
            const data = [
              ...this.state.form[field]
            ];
            data[0] = empty;
            this.setState({
                form: {
                    ...this.state.form,
                    [field]: data,
                }
            });
        }
    }

    removeProject = (index) => () => {
        const projects = [
          ...this.state.form.projects.slice(0, index),
          ...this.state.form.projects.slice(index + 1)
        ];
        this.setState({
            form: {
                ...this.state.form,
                projects,
            }
        });
    }

    render () {
        const mode = DetailView.getMode(this.props.location);
        const id = this.props.match.params.id;

        if ((mode === MODE.NEW || mode === MODE.EDIT) && !USER_IS_CIPH) {
            return <span>No Permission! To be able to {mode}, you need to be in the group "CIPH_contributor"</span>;
        }
        if (this.props.meta.categories.length === 0 || this.props.fetching){
            return <div />;
        } else if (!this.props.fetching && !this.props.idea && mode !== MODE.NEW) {
            return <span>Not Found</span>;
        }
        let lastEditedBy = "";
        let editedAt = "";
        if (this.props.versions !== undefined && this.props.versions) {
            // latest version is always first
            const currentVersion = this.props.versions[0];
            lastEditedBy = this.props.meta.users_by_id[currentVersion.user_id].full_name;
            editedAt = moment(currentVersion.date_created).format('MMMM Do YYYY, h:mm a');
        }
        return (
            <Container fluid style={{ height: '100%', overflow: 'auto' }}>
                {/*<ul>
                    {USER_GROUPS.map((value, index) =>
                        <li key={index}>{value}</li>
                    )}
                </ul>
                */}
                <Row>
                    <Col sm={{ size: 10, offset: 1 }}>
                        <Crumbs mode={mode} id={id} idea={this.props.idea} />
                    </Col>
                </Row>
                <Row>
                    {mode === MODE.VIEW &&
                        <Col sm={{ size: 10, offset: 1 }}>
                            <p>Last Edited By: {lastEditedBy} @ {editedAt}</p>
                        </Col>
                    }
                </Row>
                <Form>
                    <Row form>
                        <Col sm={{ size: '6', offset: 1 }}>
                            <legend>Basics</legend>
                            <FormField
                                field="name"
                                type="text"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.name : this.state.form.name}
                                error={this.state.errors.name}
                                mode={mode}
                            />
                            <FormField
                                field="summary"
                                type="text"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.summary : this.state.form.summary}
                                error={this.state.errors.summary}
                                mode={mode}
                            />
                            <FormField
                                field="motivation"
                                type="text"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.motivation : this.state.form.motivation}
                                error={this.state.errors.motivation}
                                mode={mode}
                            />
                            <FormField
                                field="category"
                                type="select"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.category : this.state.form.category}
                                error={this.state.errors.category}
                                mode={mode}
                                options={this.props.meta.categories}
                            />
                            <FormField
                                field="_type"
                                type="text"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea._type : this.state.form._type}
                                error={this.state.errors._type}
                                mode={mode}
                            />
                            <FormField
                                field="process_nodes"
                                type="select"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.process_nodes : this.state.form.process_nodes}
                                error={this.state.errors.process_nodes}
                                mode={mode}
                                options={this.props.meta.processes}
                            />
                            <FormField
                                field="discipline"
                                type="select"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.discipline : this.state.form.discipline}
                                error={this.state.errors.discipline}
                                mode={mode}
                                options={this.props.meta.disciplines}
                            />
                            <FormField
                                field="scope"
                                type="select"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.scope : this.state.form.scope}
                                error={this.state.errors.scope}
                                mode={mode}
                                options={this.props.meta.scopes}
                            />
                            <FormField
                                field="link_page"
                                type="text"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.link_page : this.state.form.link_page}
                                error={this.state.errors.link_page}
                                mode={mode}
                            />
                            <FormField
                                field="projects"
                                type="project"
                                onChange={this.onChange}
                                addProject={this.addProject}
                                removeProject={this.removeProject}
                                value={mode === MODE.VIEW ? this.props.idea.projects : this.state.form.projects}
                                error={this.state.errors.projects}
                                mode={mode}
                            />
                            <legend>Details</legend>
                            <FormField
                                field="description"
                                type="rich_text"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.description : this.state.form.description}
                                error={this.state.errors.description}
                                mode={mode}
                            />
                        </Col>
                        <Col sm={{ size: '3', offset: 1 }}>
                            <legend>Admin</legend>
                            <FormField
                                field="priority"
                                type="select"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.priority : this.state.form.priority}
                                error={this.state.errors.priority}
                                mode={mode}
                                options={this.props.meta.priorities}
                            />
                            <FormField
                                field="status"
                                type="select"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.status : this.state.form.status}
                                error={this.state.errors.status}
                                mode={mode}
                                options={this.props.meta.statuses}
                            />
                            <FormField
                                field="status_comment"
                                type="text"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.status_comment : this.state.form.status_comment}
                                error={this.state.errors.status_comment}
                                mode={mode}
                            />
                            <FormField
                                field="resources"
                                type="text"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.resources : this.state.form.resources}
                                error={this.state.errors.resources}
                                mode={mode}
                            />
                            <FormField
                                field="owner"
                                type="user"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.owner : this.state.form.owner}
                                error={this.state.errors.owner}
                                mode={mode}
                            />
                            <FormField
                                field="dm_sponsor"
                                type="user"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.dm_sponsor : this.state.form.dm_sponsor}
                                error={this.state.errors.dm_sponsor}
                                mode={mode}
                            />
                            <FormField
                                field="reviewers"
                                type="user"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.reviewers : this.state.form.reviewers}
                                error={this.state.errors.reviewers}
                                mode={mode}
                            />
                            <FormField
                                field="start_date"
                                type="date"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.start_date : this.state.form.start_date}
                                error={this.state.errors.start_date}
                                mode={mode}
                            />
                            <FormField
                                field="requirement_review"
                                type="date"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.requirement_review : this.state.form.requirement_review}
                                error={this.state.errors.requirement_review}
                                mode={mode}
                            />
                            <FormField
                                field="complete_date"
                                type="date"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.complete_date : this.state.form.complete_date}
                                error={this.state.errors.complete_date}
                                mode={mode}
                            />
                            <FormField
                                field="date_added"
                                type="date"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.date_added : this.state.form.date_added}
                                error={this.state.errors.date_added}
                                mode={mode}
                            />
                            <FormField
                                field="proposer"
                                type="user"
                                onChange={this.onChange}
                                value={mode === MODE.VIEW ? this.props.idea.proposer : this.state.form.proposer}
                                error={this.state.errors.proposer}
                                mode={mode}
                            />
                        </Col>
                    </Row>
                    <Row form>
                        <Col sm={{ size: 10, offset: 1 }}>
                            <legend style={{fontSize: '0.875rem'}}> Diagrams </legend>
                            <AttachmentField
                                field="diagrams"
                                type="file"
                                onChange={this.onChange}
                                mode={mode}
                                addFile={this.addFile("diagrams")}
                                removeFile={this.removeFile}
                                value={mode === MODE.VIEW ? this.props.idea.diagrams : this.state.form.diagrams}
                            />
                        </Col>
                    </Row>
                    <Row form>
                        <Col sm={{ size: 10, offset: 1 }}>
                            <legend style={{fontSize: '0.875rem'}}> Attachments </legend>
                            <AttachmentField
                                field="attachments"
                                type="file"
                                onChange={this.onChange}
                                mode={mode}
                                addFile={this.addFile("attachments")}
                                removeFile={this.removeFile}
                                value={mode === MODE.VIEW ? this.props.idea.attachments : this.state.form.attachments}
                            />
                        </Col>
                    </Row>
                    { mode !== MODE.VIEW &&
                        <Row form className="pt-2">
                            <Col sm={{ size: 10, offset: 1 }}>
                                <Button color="primary" block className="float-right" onClick={this.submit}>
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    }
                </Form>
                { mode === MODE.VIEW &&
                    <Row>
                        <Col sm={{ size: 10, offset: 1 }} className="mb-3">
                            <legend>Comments</legend>
                            <CommentThread comments={this.props.idea.comments} ideaId={this.props.idea.id} />
                        </Col>
                    </Row>
                }
            </Container>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return ({
            fetchMeta: () => { return dispatch(fetchMeta()) },
            createIdea: (idea) => {  return dispatch(createIdea(idea)) },
            editIdea: (idea, id) => { return dispatch(editIdea(idea, id)) },
            fetchIdeas: () => { return dispatch(fetchIdeas()) },
            fetchVersionHistory: (idea) => { return dispatch(fetchVersionHistory(idea)) },
    });
};

const getIdea = (ideas, id) => ideas[id];
const getVersions = (versions, id) => versions[id];

const mapStateToProps = (state, props) => {
    const id = props.match.params.id;
    return {
        meta: state.meta,
        idea: getIdea(state.ideas.ideas, id),
        versions: getVersions(state.ideas.versions, id),
        fetching: state.ideas.isFetching || state.meta.isFetching,
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(DetailView);

