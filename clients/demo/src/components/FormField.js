import React from "react";
import { Col, FormGroup, FormFeedback, Label, Input, Badge, Button, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { default as VirtualizedSelect } from "react-virtualized-select";
import Select from "react-select";
import TinyMCE from 'react-tinymce';

import * as Lookup from '../lookup';
import { REQUIRED_FIELDS, MODE } from '../consts';
import { getTinyConfig } from '../tinyConfig';


const ProjectEditInput = (props) => {
    const { field, label, value, meta, index } = props;
    const colorOptions = Object.values(meta.project_priorities).map(o => {
        const style = {
            color: o.foreground,
            background: o.background,
        }
        return (
            <option key={`${index}-${o.description}`} style={style} value={o.id} >{o.description}</option>
        );
    });

    const { priority, project } = value;
    const priorityColor = meta.project_priorities[priority];
    const priorityStyle = {
        color: priorityColor.foreground,
        background: priorityColor.background,
    }

    const options = Object.entries(props.meta.projects).map(([k,v]) => ({label: v, value: k}));
    return (
        <Row className="pb-2" >
            <Col sm={6}>
                <Select.Creatable
                    options={options}
                    value={project}
                    onChange={props.onChange(field, 'project', index)}
                    clearable={false}
                />
            </Col>
            <Col sm={5}>
                <Input
                    bsSize="sm"
                    type="select"
                    name={field}
                    placeholder={`Set ${label}`}
                    onChange={props.onChange(field, 'priority', index)}
                    value={priority}
                    invalid={props.invalid}
                    style={priorityStyle}
                >
                    { colorOptions }
                </Input>
            </Col>
            { index > 0 &&
                <Button color="danger" size="sm" onClick={props.removeProject(index)}>
                    Delete
                </Button>
            }
        </Row>
    );
}

const ProjectField = (props) => {
    const { value, ...otherProps } = props;
    const projectInputs = value.map((v, i) =>
        <ProjectEditInput
            {...otherProps}
            value={v}
            index={i}
            key={`${v.project}-${v.priority}-${i}`}
        />
    );

    return (
        <React.Fragment>
            <Row>
                <Col sm={6}>
                    Project
                </Col>
                <Col sm={5}>
                    Priority
                </Col>
            </Row>
            { projectInputs }
            <Row>
                <Col sm={{ size: 7, offset: 2 }}>
                    <Button color="success" size="sm" block onClick={props.addProject}>
                        Add
                    </Button>
                </Col>
            </Row>
        </React.Fragment>
    );
}

const FormEditInput = (props) => {
    const { field, type } = props;
    const label = Lookup.idea[field];

    switch(type) {
        case 'select': {
            return (
                <Input
                    bsSize="sm"
                    type={type}
                    name={field}
                    placeholder={`Set ${label}`}
                    onChange={props.onChange(field)}
                    value={props.value}
                    invalid={props.invalid}
                >
                    { Object.entries(props.options).map(([v, o]) =>
                        <option value={v} key={`${field}-${o}`}>
                            {o}
                        </option>
                    )}
                </Input>
            );
        }
        case 'user': {
            const value = (Object.prototype.hasOwnProperty(props.value, 'username')) ? props.value.username : props.value;
            return (
                <VirtualizedSelect
                    options={props.meta.users}
                    labelKey="full_name"
                    valueKey="username"
                    value={value}
                    multi={Array.isArray(props.value)}
                    onChange={props.onChange(field)}
                    clearable={!props.required}
                />
            );
        }
        case 'project': {
            return <ProjectField {...props} />
        }
        case 'rich_text': {
            return <TinyMCE
                key="tinymce-edit"
                id="tinymce-edit"
                config={getTinyConfig(false)}
                content={props.value}
                onChange={props.onChange(field)}
                onUndo={props.onChange(field)}
                onRedo={props.onChange(field)}
            />
        }
        case 'date':
        case 'text':
        default:
        return (
            <Input
                bsSize="sm"
                type={type}
                name={field}
                placeholder={`Enter ${label}`}
                onChange={props.onChange(field)}
                value={props.value}
                invalid={props.invalid}
                maxLength={Lookup.max_len[field]}
            />
        );
    }

}

const FormReadOnlyField = (props) => {
    const { type, value, meta } = props;

    switch(type) {
        case 'user': {
            let str = "";
            if (Array.isArray(value)) {
                str = value.map(v => meta.users_by_id[v].full_name).join(", ");
            } else if(value)  {
                str = meta.users_by_id[value].full_name;
            }
            return (
                <span className="form-value">{str}</span>
            );
        }
        case 'project': {
            const badges = value.map(p => {
                const priority = meta.project_priorities[p.priority];
                const style = {
                    backgroundColor: priority.background,
                    color: priority.foreground,
                    border: '1px solid black',
                }
                const name = meta.projects[p.project]
                return <Badge key={`${p.project}-${p.priority.description}`} style={style}>{name}</Badge>;
            });
            return <span className="form-value">{badges}</span>;
        }
        case 'select': {
            return <span className="form-value">{props.options[value]}</span>;
        }
        case 'date':
        case 'text':
        default:
        return (
            <span className="form-value" dangerouslySetInnerHTML={{'__html':value}} />
        );
    }
}

const FormField = (props) => {
    const { field, mode } = props;
    const label = Lookup.idea[field];
    const required = REQUIRED_FIELDS.includes(field);

    let error = props.error;
    if ( mode !== MODE.VIEW ) {
        if ( Lookup.max_len[field] !== undefined && props.value.length === Lookup.max_len[field]) {
            error = `The max length for this field is ${Lookup.max_len[field]}`;
        }
    }

    return (
        <FormGroup row className="mb-1">
            <Label size="sm" for={field} sm={3}>
                {label}{ required && <span className="text-danger">*</span>}
            </Label>
            <Col sm={9}>
                { mode !== MODE.VIEW &&
                    <FormEditInput {...props} required={required} invalid={Boolean(error)} />
                }
                { mode === MODE.VIEW &&
                    <FormReadOnlyField {...props} required={required} invalid={Boolean(error)} />
                }
                <FormFeedback>{error}</FormFeedback>
            </Col>
        </FormGroup>
    );

};

const mapStateToProps = (state) => {
    return {
        meta: state.meta,
    };
};

export default connect(mapStateToProps)(FormField);

