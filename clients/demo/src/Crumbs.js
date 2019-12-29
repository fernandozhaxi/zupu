import React from "react";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from "react-router-dom";

import { MODE } from '../consts';

const Crumbs = (props) => {
    const { id, idea, mode } = props;

    const breadCrumbs = [
        <BreadcrumbItem key="ideas"><Link to="/">Ideas</Link></BreadcrumbItem>
    ];

    switch (mode) {
    case MODE.VIEW:
        breadCrumbs.push(<BreadcrumbItem key="idea-name" active >{idea.name}</BreadcrumbItem>);
        breadCrumbs.push(
            <BreadcrumbItem key="idea-edit" className="breadcrumb-right">
                <Link className="btn btn-primary pt-0 pb-0 mr-2" size="sm" to={`/history/${id}`}>
                    History
                </Link>
                <Link className="btn btn-primary pt-0 pb-0" size="sm" to={`/edit/${id}`}>
                    Edit
                </Link>
            </BreadcrumbItem>
        );
        break;
    default:
    case MODE.NEW:
        breadCrumbs.push(<BreadcrumbItem key="idea-new" active >New</BreadcrumbItem>);
        break;
    case MODE.EDIT:
        breadCrumbs.push(
            <BreadcrumbItem key="idea-name">
                <Link to={`/view/${id}/`}>{idea.name}</Link>
            </BreadcrumbItem>
        );
        breadCrumbs.push(<BreadcrumbItem key="idea-edit" active >Edit</BreadcrumbItem>);
        break;
    case MODE.HISTORY:
        breadCrumbs.push(
            <BreadcrumbItem key="idea-name">
                <Link to={`/view/${id}/`}>{idea.name}</Link>
            </BreadcrumbItem>
        );
        breadCrumbs.push(<BreadcrumbItem key="idea-history" active >History</BreadcrumbItem>);
        breadCrumbs.push(
            <BreadcrumbItem key="idea-edit" className="breadcrumb-right">
                <Link className="btn btn-primary pt-0 pb-0" size="sm" to={`/edit/${id}`}>
                    Edit
                </Link>
            </BreadcrumbItem>
        )
        break;
    }

    return (
      <Breadcrumb className="pt-3">
          { breadCrumbs }
      </Breadcrumb>
    );
}

export default Crumbs;

