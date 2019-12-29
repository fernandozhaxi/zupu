import React from "react";
import { Button, Media, Input } from 'reactstrap';
import { connect } from 'react-redux';

import md5 from 'js-md5';

import { createComment, fetchIdea } from '../actions';

const Comment = (props) => {
    const { user, text } = props.comment;

    const userObj = props.users.find(u => u.username === user);

    const hash = md5(userObj.email.toLowerCase());

    const url = `https://www.gravatar.com/avatar/${hash}`
    return (
        <Media className="comment pt-2 pb-2">
            <Media left >
                <Media src={url} className="pr-2" alt="Profile" style={{maxHeight: '64px', maxWidth: '64px'}} />
            </Media>
            <Media body>
                <h6>{ userObj.full_name }</h6>
                {text}
            </Media>
        </Media>
    );
}


const CommentBox = (props) => (
    <React.Fragment>
        <Input onChange={props.onChange} value={props.value} type="textarea" name="comment-text" />
        <Button color="primary" className="float-right mt-2" onClick={props.submitComment}>Submit</Button>
    </React.Fragment>
)

class CommentThread extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            commentText: '',
        };
    }

    handleSubmit = () => {
        const ideaId = this.props.ideaId;
        const comment = {
            text: this.state.commentText,
        }
        this.props.createComment(comment, ideaId)
            .then(() => {
                this.props.fetchIdea(ideaId);
                this.setState({ commentText: '' });
            });
    }

    handleChange = (e) => {
        this.setState({ commentText: e.target.value });
    }

    render() {
        const { users, comments } = this.props;
        return (
            <React.Fragment>
                { comments.map(c => <Comment comment={c} key={`comment-${c.id}`} users={users} />) }
                <CommentBox
                    value={this.state.commentText}
                    onChange={this.handleChange}
                    submitComment={this.handleSubmit}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.meta.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return ({
        createComment: (comment, idea) => { return dispatch(createComment(comment, idea)) },
        fetchIdea: (idea) => { return dispatch(fetchIdea(idea)) },
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentThread);

