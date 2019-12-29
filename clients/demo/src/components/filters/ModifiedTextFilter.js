import React from "react";

class ModifiedTextFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = { value: props.defaultValue }
    }

    componentDidMount() {
        if (this.props.defaultValue) {
            this.props.onFilter(this.props.defaultValue);
        }
    }

    filter = (e) => {
        const { value } = e.target;
        this.setState(() => ({ value }));
        this.props.onFilter(value);
        this.props.updateBar(this.props.column, value);
    }

    render() {
        const selectClass =
            `filter ${this.props.className} form-control }`;
        return (
            <input
                className={ selectClass }
                onChange={ this.filter }
                onClick={ e => e.stopPropagation() }
                ref={ n => this.selectInput = n }
                value={this.state.value}
            />
        );
    }
}

export default ModifiedTextFilter;

