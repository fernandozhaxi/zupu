import React from "react";
import { connect } from 'react-redux';

import { updateSettingField } from '../actions';
import * as Lookup from '../lookup';

const FIELDS = [
    'discipline',
    'name',
    'scope',
    'category',
    '_type',
    'process_nodes',
    'summary',
    'projects',
    'motivation',
    'priority',
    'status',
    'status_comment',
    'resources',
    'link_page',
    'owner',
    'reviewers',
    'dm_sponsor',
    'start_date',
    'requirement_review',
    'complete_date',
    'proposer',
    'date_added',
    'external_link',
];

export const caseInsensitiveSort = (a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase());

class Settings extends React.Component {

    onChange = (field) => (e) => {
        this.props.updateSettingField(field, e.target.checked);
    }

    render() {
        const sortedFields = FIELDS.sort((a, b) => caseInsensitiveSort(Lookup.idea[a], Lookup.idea[b]));
        const boxes = sortedFields.map((field) => {
            const value = this.props.fields.includes(field);
            return (
                <li style={{listStyle: "none"}} key={`${field}-settings`}>
                    <label>
                        <input
                            type="checkbox"
                            style={{marginRight: '0.3em'}}
                            checked={value}
                            onChange={this.onChange(field)}
                        />
                        {Lookup.idea[field]}
                    </label>
                </li>
            );
        });

        return (
            <div style={{columns: "6 8em"}}>
                {boxes}
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        fields: state.settings.settings
    };
};

const mapDispatchToProps = (dispatch) => {
    return ({
            updateSettingField: (field, checked) => { dispatch(updateSettingField(field, checked)) },
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

