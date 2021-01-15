import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { has } from 'ramda';

import TextField from '@material-ui/core/TextField';

import useStyles from './useStyles';

const Form = ({ errors, onChange, task }) => {
  const handleChangeField = useCallback((e) => onChange({ ...task, [e.target.name]: e.target.value }), [
    onChange,
    task
  ]);

  const styles = useStyles();

  return (
    <form className={styles.root}>
      <TextField
        error={has('name', errors)}
        helperText={errors.name}
        onChange={handleChangeField}
        value={task.name}
        name='name'
        label='Name'
        required
        margin='dense'
      />
      <TextField
        error={has('description', errors)}
        helperText={errors.description}
        onChange={handleChangeField}
        value={task.description}
        name='description'
        label='Description'
        required
        multiline
        margin='dense'
      />
    </form>
  );
};

Form.propTypes = {
  onChange: PropTypes.func.isRequired,
  task: PropTypes.shape().isRequired,
  errors: PropTypes.shape({
    name: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.arrayOf(PropTypes.string),
    assignee: PropTypes.arrayOf(PropTypes.string)
  })
};

Form.defaultProps = {
  errors: {}
};

export default Form;
