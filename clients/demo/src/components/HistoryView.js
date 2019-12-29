import React, { Component } from "react";
import { connect } from 'react-redux';
import moment from 'moment';
import { success } from 'react-notification-system-redux';
import { Col, Container, Row, Button, Table } from 'reactstrap';

import Crumbs from './Crumbs';
import { MODE } from '../consts';
import { USER_IS_CIPH} from '../permissions';
import {
    fetchMeta,
    createIdea,
    editIdea,
    fetchIdeas,
    fetchVersionHistory,
    restoreVersion,
} from '../actions';

class HistoryView extends Component {

    componentDidMount() {
        this.props.fetchMeta();
        this.props.fetchIdeas();
        const id = this.props.match.params.id;
        this.props.fetchVersionHistory(id);
    }

    findUser = (v) => {
        const u = this.props.meta.users.find(u => u.username === v.user_id);
        if (u) {
            return u.full_name;
        }
        return "";
    }

    restore = (version) => () => {
        const id = this.props.match.params.id;
        this.props.restoreVersion(id, version).then(() => {
            const notification = {
                title: 'Revert successful',
                message: `Idea has sucessfully been reverted to version ${version}`,
                position: 'br',
                autoDismiss: 5,
            }
            this.props.success(notification);
            this.props.history.push(`/view/${id}`)
        });
    };

    render () {
        const id = this.props.match.params.id;
        if (this.props.meta.categories.length === 0 || this.props.fetching || !this.props.versions){
            return <div />;
        } else if (!this.props.fetching && !this.props.idea) {
            return <span>Not Found</span>;
        }
        return (
            <Container fluid style={{ height: '100%', overflow: 'auto' }}>
                <Row>
                    <Col sm={{ size: 10, offset: 1 }}>
                        <Crumbs mode={MODE.HISTORY} id={id} idea={this.props.idea} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ size: 10, offset: 1 }}>
                        <Table size="sm">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Version</th>
                                    <th>Created</th>
                                    <th>Changed By</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.versions.map((v,i) =>
                                    <tr key={`version-${v.date_created}`}>
                                        <td><input type="checkbox" /></td>
                                        { i !== 0 ?
                                            <td>v. {this.props.versions.length - i}</td>
                                            :
                                            <td>Current</td>
                                        }
                                        <td>{moment(v.date_created).format('MMMM Do YYYY, h:mm a')}</td>
                                        <td>{this.findUser(v)}</td>
                                        <td>
                                            { i !== 0 && USER_IS_CIPH &&
                                                <Button onClick={this.restore(this.props.versions.length - i)} size="sm" color="primary">
                                                    Restore
                                                </Button>
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
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
            restoreVersion: (id, version) => { return dispatch(restoreVersion(id, version)) },
            success: (notification) => { return dispatch(success(notification)) },
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
        fetching: state.ideas.isFetching,
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(HistoryView);

