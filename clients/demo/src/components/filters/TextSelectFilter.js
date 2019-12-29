import React from "react";

class TextSelectFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isSelected: Boolean(props.defaultValue), value: props.defaultValue }
    }

    componentDidMount() {
        if (this.props.defaultValue) {
            this.props.onFilter(this.props.defaultValue);
        }
    }

    filter = (e) => {
        const { value } = e.target;
        this.setState(() => ({ isSelected: value !== '', value }));
        this.props.onFilter(value);
        this.props.updateBar(this.props.column, value);
    }

    getOptions = () => {
        const optionTags = [];
        const { options, withoutEmptyOption } = this.props;
        if (!withoutEmptyOption) {
            optionTags.push((
                <option key="-1" value="">{ }</option>
            ));
        }
        options.forEach((label) =>
            optionTags.push(<option key={ `${label}-option` } value={ label }>{ label }</option>)
        );
        return optionTags;
    }
    render() {
        const selectClass =
            `filter select-filter ${this.props.className} form-control ${this.state.isSelected ? '' : 'placeholder-selected'}`;
        return (
            <select
                className={ selectClass }
                onChange={ this.filter }
                onClick={ e => e.stopPropagation() }
                ref={ n => this.selectInput = n }
                value={this.state.value}
            >
                { this.getOptions() }
            </select>
        );
    }
}

export default TextSelectFilter;

