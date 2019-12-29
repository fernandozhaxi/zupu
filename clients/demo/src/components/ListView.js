import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filterFactory, {
    dateFilter,
    textFilter,
    multiSelectFilter,
} from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import { Row, Col, Badge } from 'reactstrap';
import qs from 'query-string';
import _ from 'lodash';

import { fetchIdeas, fetchMeta, fetchSettings } from '../actions';
import ModifiedTextFilter from './filters/ModifiedTextFilter';
import * as Lookup from '../lookup';
import { TABLE_FIELDS as FIELDS } from '../consts';

import { getIdeaList } from '../selectors';
import Settings from './Settings';

class ListView extends Component {

    constructor(props) {
        super(props);
        this.filters = {};
        this.state  = { hideSettings: false};
    }

    componentDidMount() {
        const promises = [];
        promises.push(this.props.fetchIdeas());
        promises.push(this.props.fetchMeta());
        promises.push(this.props.fetchSettings());
        Promise.all(promises).then(() => {
            const query = qs.parse(window.location.search)
            Object.entries(query).forEach(([f, v]) => {
                let value = v;
                if (!Array.isArray(v)) {
                    value = [value]
                }
                this.filters[f](value);
            });
        });
    }

    projectFormatter = (cell, row) => {
        const projects = cell;
        const ret = projects.map(p => {
            const c = this.props.meta.project_priorities[p.priority];
            const style = {
                backgroundColor: c.background,
                color: c.foreground,
                border: '1px solid black',
            }
            const name = this.props.meta.projects[p.project];
            return <Badge key={`${row.id}-${p.project}-${c.description}`} style={style}>{name}</Badge>;
        });
        return ret;
    }

    projectFilterValue = (cell, row) => {
        const projects = cell;
        return projects.map(p => this.props.meta.projects[p.project]).join(" ");
    }

    userFormatter = (cell) => {
        if (cell) {
            if (Array.isArray(cell)) {
                return cell.map((v) => {
                    const { first_name, last_name } = this.props.meta.users_by_id[v];
                    return `${first_name} ${last_name}`;
                });
            }
            const { first_name, last_name } = this.props.meta.users_by_id[cell];
            return `${first_name} ${last_name}`;
        }
    }

    filterByProject = filterVal => {
        this.onFilter({ dataField: 'projects' }, filterVal);
        // eslint-disable-next-line eqeqeq
        console.log(filterVal);
        if (filterVal.length === 0) {
            return this.props.ideas;
        }

        return this.props.ideas.filter(i => {
            return i.projects.some(p => {
                return filterVal.includes(`${p.project}`)
            })
        });
    }

    getColumns = () => {
        const query = qs.parse(window.location.search)

        const emptyDate = new Date();
        const columns = FIELDS.map(f => {
            const hidden = !this.props.fields.includes(f);
            if (hidden) {
                return null;
            }
            switch(f) {
            case 'projects':
                return ({
                    dataField: 'projects',
                    text: Lookup.idea[f],
                    formatter: this.projectFormatter,
                    headerStyle: { minWidth: '10em', width: '10em', textAlign: 'center' },
                    filterValue: (cell, row) => this.projectFilterValue(cell, row),
                    sort: true,
                });
            case 'owner':
            case 'reviewers':
            case 'dm_sponsor':
            case 'proposer':
                return ({
                    dataField: `${f}`,
                    text: Lookup.idea[f],
                    sort: true,
                    formatter: this.userFormatter,
                    headerStyle: { minWidth: '15em', width: '15em', textAlign: 'center' },
                });
            case 'start_date':
            case 'requirement_review':
            case 'complete_date':
            case 'date_added':
                return ({
                    dataField: f,
                    text: Lookup.idea[f],
                    headerStyle: { minWidth: '16em', width: '16em', textAlign: 'center' },
                    filter: dateFilter({
                        className: "form-control-sm",
                        dateClassName: "form-control-sm",
                        comparatorClassName: "form-control-sm",
                    }),
                    filterValue: (cell, row) => cell ? cell : emptyDate,
                    sort: true,
                });
            case 'discipline':
                return ({
                    dataField: f,
                    text: Lookup.idea[f],
                    filter: multiSelectFilter({
                        options: this.props.meta.disciplines,
                        onFilter: filterVal => this.onFilter({dataField: f}, filterVal),
                        getFilter: (filter) => {
                            this.filters[f] = filter;
                        },
                    }),
                    formatter: cell => this.props.meta.disciplines[cell],
                    filterValue: cell => this.props.meta.disciplines[cell],
                    sort: true,
                    headerStyle: { minWidth: '10em', width: '10em', textAlign: 'center' },
                });
            case 'scope':
                return ({
                    dataField: f,
                    text: Lookup.idea[f],
                    filter: multiSelectFilter({
                        options: this.props.meta.scopes,
                        onFilter: filterVal => this.onFilter({dataField: f}, filterVal),
                        getFilter: (filter) => {
                            this.filters[f] = filter;
                        },
                    }),
                    formatter: cell => this.props.meta.scopes[cell],
                    filterValue: cell => this.props.meta.scopes[cell],
                    sort: true,
                    headerStyle: { minWidth: '10em', width: '10em', textAlign: 'center' },
                });
            case 'category':
                return ({
                    dataField: f,
                    text: Lookup.idea[f],
                    filter: multiSelectFilter({
                        options: this.props.meta.categories,
                        onFilter: filterVal => this.onFilter({dataField: f}, filterVal),
                        getFilter: (filter) => {
                            this.filters[f] = filter;
                        },
                    }),
                    formatter: cell => this.props.meta.categories[cell],
                    filterValue: cell => this.props.meta.categories[cell],
                    sort: true,
                    headerStyle: { minWidth: '10em', width: '10em', textAlign: 'center' },
                });
            case 'process_nodes':
                return ({
                    dataField: f,
                    text: Lookup.idea[f],
                    filter: multiSelectFilter({
                        options: this.props.meta.processes,
                        onFilter: filterVal => this.onFilter({dataField: f}, filterVal),
                        getFilter: (filter) => {
                            this.filters[f] = filter;
                        },
                    }),
                    formatter: cell => this.props.meta.processes[cell],
                    filterValue: cell => this.props.meta.processes[cell],
                    sort: true,
                    headerStyle: { minWidth: '10em', width: '10em', textAlign: 'center' },
                });
            case 'status':
                return ({
                    dataField: f,
                    text: Lookup.idea[f],
                    filter: multiSelectFilter({
                        options: this.props.meta.statuses,
                        onFilter: filterVal => this.onFilter({dataField: f}, filterVal),
                        getFilter: (filter) => {
                            this.filters[f] = filter;
                        },
                    }),
                    formatter: cell => this.props.meta.statuses[cell],
                    filterValue: cell => this.props.meta.statuses[cell],
                    sort: true,
                    headerStyle: { minWidth: '10em', width: '10em', textAlign: 'center' },
                });
            case 'priority':
                return ({
                    dataField: f,
                    text: Lookup.idea[f],
                    headerStyle: { minWidth: '10em', width: '10em', textAlign: 'center' },
                    filter: multiSelectFilter({
                        options: this.props.meta.priorities,
                        onFilter: filterVal => this.onFilter({dataField: f}, filterVal),
                        getFilter: (filter) => {
                            this.filters[f] = filter;
                        },
                    }),
                    formatter: cell => this.props.meta.priorities[cell],
                    filterValue: cell => this.props.meta.priorities[cell],
                    sort: true,
                });
            case 'summary':
                return ({
                    headerStyle: { minWidth: '20em', width: '20em', textAlign: 'center' },
                    dataField: f,
                    text: Lookup.idea[f],
                    sort: true,
                    filter: textFilter({
                        className: "form-control-sm",
                    }),
                    filterRenderer: (onFilter, column) =>
                        <ModifiedTextFilter
                            updateBar={ this.onFilter }
                            onFilter={ onFilter }
                            column={ column }
                            className="form-control-sm"
                            defaultValue={ query[f] || "" }
                        />,
                });
            case 'name':
            case '_type':
            case 'motivation':
            case 'status_comment':
            case 'resources':
            case 'link_page':
            case 'external_link':
            default:
                return ({
                    headerStyle: { minWidth: '10em', width: '10em', textAlign: 'center' },
                    dataField: f,
                    text: Lookup.idea[f],
                    sort: true,
                    filter: textFilter({
                        className: "form-control-sm",
                    }),
                    filterRenderer: (onFilter, column) =>
                        <ModifiedTextFilter
                            updateBar={ this.onFilter }
                            onFilter={ onFilter }
                            column={ column }
                            className="form-control-sm"
                            defaultValue={ query[f] || "" }
                        />,
                });
            }
        });
        return columns.filter(c => c !== null);
    }

    onRowClick = (e, row, rowIndex) => {
        this.props.history.push(`/view/${row.id}/`);
    }

    onFilter = (column, value) => {
        let input = value;
        const query =  qs.parse(window.location.search);
        if (Array.isArray(value) && value.length === 1) {
            input = value[0];
        }

        query[column.dataField] = input;
        Object.keys(query).forEach((key) => (query[key] === "") && delete query[key]);

        if (!_.isEqual(query, qs.parse(window.location.search))) {
            window.history.replaceState({}, "", "?" + qs.stringify(query));
        }
    }

    onSearch = (onSearch) => (input) => {
        const query = qs.parse(window.location.search);
        query.search = input;

        this.props.history.replace({
            search: qs.stringify(query)
        });
        onSearch(input);
    }

    hide = () => {
        this.setState({hideSettings: !this.state.hideSettings})
    }

    render () {
        if (this.props.isFetching){
            return <div />;
        }

        const rowEvents = {
            onClick: (e, row, rowIndex) => {
                if ( e.button !== 1 ) {
                    this.onRowClick(e, row, rowIndex);
                }
            }
        }
        const { SearchBar } = Search;

        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        const defaultSearch = searchParams.get('search');

        const rowStyle = { cursor: 'pointer' };

        return (
            <ToolkitProvider
                keyField='id'
                data={ this.props.ideas }
                columns={ this.getColumns() }
                search= {{ defaultSearch: defaultSearch }}
            >
                {
                props => (
                    <React.Fragment>
                        <div style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
                            {!this.state.hideSettings && <Settings />}
                        </div>
                        <Row >
                            <Col ><SearchBar { ...props.searchProps } onSearch={this.onSearch(props.searchProps.onSearch)} /></Col>
                            {this.state.hideSettings && <Col ><button onClick={this.hide}> Show Settings </button></Col>}
                            {!this.state.hideSettings && <Col ><button onClick={this.hide}> Hide Settings </button></Col>}
                        </Row>
                        <div style={{ overflowX: 'auto', height: '100%', padding: '10px' }}>
                            <BootstrapTable
                                { ...props.baseProps }
                                striped
                                bordered
                                classes="table-sm"
                                filter= { filterFactory() }
                                bootstrap4
                                rowEvents={ rowEvents }
                                hover
                                rowStyle={ rowStyle }
                                ref={ n => this.node = n}
                            />
                        </div>
                    </React.Fragment>
                )
            }
            </ToolkitProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ideas: getIdeaList(state),
        meta: state.meta,
        fields: state.settings.settings,
        isFetching: state.meta.isFetching || state.settings.isFetching || state.ideas.isFetching,
    };
};

const mapDispatchToProps = (dispatch) => {
    return ({
            fetchIdeas: () => { return dispatch(fetchIdeas()) },
            fetchMeta: () => { return dispatch(fetchMeta()) },
            fetchSettings: () => { return dispatch(fetchSettings()) },
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(ListView);

