import React from "react";
import { Button, Col, Row, FormGroup, Input, Label } from 'reactstrap';

import { MODE } from '../consts';

const AttachmentEditField = (props) => {
    let input;
    const value = props.value;
    if (props.value.filepath.length && !props.value.file) {
        const filename = value.filepath.substr(value.filepath.lastIndexOf('/') + 1);
        input = (
            <a href={value.filepath}>{filename}</a>
        );
    } else {
        input = (
            <Input
                type="file"
                value={props.value.filepath}
                onChange={props.onChange(props.field, "filepath", props.index)}
                bsSize="sm"
            />
        );
    }

    return(
       <FormGroup row size="sm">
               <Col sm={2}>
                   {input}
                </Col>
               <Col sm={9}>
                   <Row>
                   <Col sm={"auto"}>
                       <Label size="sm">Description</Label>
                   </Col>
                   <Col sm={8}>
                        <Input
                            type="text"
                            bsSize="sm"
                            value={value.description}
                            onChange={props.onChange(props.field, "description", props.index)}
                        />
                    </Col>
                    <Col sm={1}>
                        <Button block color="danger" size="sm" onClick={props.removeFile(props.field, props.index)}>
                            { props.index ? "Delete" : "Clear" }
                        </Button>
                    </Col>
                    </Row>
                </Col>
        </FormGroup>
    );
}


const AttachmentReadItem = (props) => {
    const value = props.attachment;
    const filename = value.filepath.substr(value.filepath.lastIndexOf('/') + 1);
    return (
        <li>
            <a href={value.filepath}>{filename}</a> - <span>{value.description}</span>
        </li>
    );
}

const DiagramReadCard = (props) => {
    return (
        <div style={{textAlign: "center"}}>
            <img alt="" src={props.diagram.filepath} style={{maxWidth:"100%"}} />
            <p>Caption: {props.diagram.description}</p>
        </div>
    );
}

const AttachmentField = (props) => {
    const { mode, value, addFile, ...otherProps } = props;
    if (mode === MODE.VIEW) {
        if (props.field === "attachments") {
            return (
                <ul>
                    {value.map(a => <AttachmentReadItem key={`${a.id}-attachment`} attachment={a} />)}
                </ul>
            )
        }
        return (
            value.map(d => <DiagramReadCard key={`${d.id}-diagram`} diagram={d} />)
        )
    }
    if (mode === MODE.NEW) {
        let attachments;
        // if the user already set some attachments
        if (value.length > 0) {
            attachments = value.map((a, i) => <AttachmentEditField {...otherProps} key={`${a.filename}-attachment`} value={a} index={i} />)
        } else {
            attachments = <AttachmentEditField {...otherProps} index={0} />
        }
        return (
            <React.Fragment>
                {attachments}
                <Button size="sm" color="success" onClick={addFile}>
                    Add Another File
                </Button>
            </React.Fragment>
        )
    } else {
        let attachments;
        // if the user already set some attachments
        if (value.length > 0) {
            attachments = value.map((a, i) => <AttachmentEditField key={`${a.filename}-attachment`} {...otherProps} value={a} index={i} />)
        } else {
            attachments = <AttachmentEditField {...otherProps} index={0} />
        }
        return (
            <React.Fragment>
                {attachments}
                <Button size="sm" color="success" onClick={addFile}>
                    Add Another File
                </Button>
            </React.Fragment>
        )
    }
}

export default AttachmentField;
