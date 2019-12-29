class MultiSelectFilter extends Component {
  constructor(props) {
    super(props);
    this.filter = this.filter.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    const isSelected = props.defaultValue.map(item => props.options[item]).length > 0;
    this.state = { isSelected };
  }

  componentDidMount() {
    const { getFilter } = this.props;

    const value = getSelections(this.selectInput);
    if (value && value.length > 0) {
      this.applyFilter(value);
    }

    // export onFilter function to allow users to access
    if (getFilter) {
      getFilter((filterVal) => {
        this.selectInput.value = filterVal;
        this.applyFilter(filterVal);
      });
    }
  }

  componentDidUpdate(prevProps) {
    let needFilter = false;
    if (this.props.defaultValue !== prevProps.defaultValue) {
      needFilter = true;
    } else if (!optionsEquals(this.props.options, prevProps.options)) {
      needFilter = true;
    }
    if (needFilter) {
      this.applyFilter(this.selectInput.value);
    }
  }

  getOptions() {
    const optionTags = [];
    const { options, placeholder, column, withoutEmptyOption } = this.props;
    if (!withoutEmptyOption) {
      optionTags.push((
        <option key="-1" value="">{ placeholder || `Select ${column.text}...` }</option>
      ));
    }
    Object.keys(options).forEach(key =>
      optionTags.push(<option key={ key } value={ key }>{ options[key] }</option>)
    );
    return optionTags;
  }

  cleanFiltered() {
    const value = (this.props.defaultValue !== undefined) ? this.props.defaultValue : [];
    this.selectInput.value = value;
    this.applyFilter(value);
  }

  applyFilter(value) {
    if (value.length === 1 && value[0] === '') {
      value = [];
    }
    this.setState(() => ({ isSelected: value.length > 0 }));
    this.props.onFilter(this.props.column, FILTER_TYPE.MULTISELECT)(value);
  }

  filter(e) {
    const value = getSelections(e.target);
    this.applyFilter(value);
  }

  render() {
    const {
      style,
      className,
      defaultValue,
      onFilter,
      column,
      options,
      comparator,
      withoutEmptyOption,
      caseSensitive,
      getFilter,
      ...rest
    } = this.props;

    const selectClass =
      `filter select-filter form-control ${className} ${this.state.isSelected ? '' : 'placeholder-selected'}`;

    return (
      <select
        { ...rest }
        ref={ n => this.selectInput = n }
        style={ style }
        multiple
        className={ selectClass }
        onChange={ this.filter }
        onClick={ e => e.stopPropagation() }
        defaultValue={ defaultValue !== undefined ? defaultValue : '' }
      >
        { this.getOptions() }
      </select>
    );
  }
}

