import React from 'react';
import PropTypes from 'prop-types';
import { has, isNil } from 'ramda';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import UserSelect from 'components/UserSelect';
import ImageUpload from 'components/ImageUpload';

import TaskPresenter from 'presenters/TaskPresenter';

import useStyles from './useStyles';

export const FORM_TYPES = {
  NEW: 'new',
  EDIT: 'edit'
};

const Form = ({ errors, onChange, onAttachImage, onRemoveImage, task, type }) => {
  const handleChangeField = (e) => onChange({ ...task, [e.target.name]: e.target.value });
  const handleChangeSelect = (fieldName) => (user) => onChange({ ...task, [fieldName]: user });

  const styles = useStyles();

  const isEditFormType = type === FORM_TYPES.EDIT;

  return (
    <form className={styles.root}>
      <TextField
        error={has('name', errors)}
        helperText={errors.name}
        onChange={handleChangeField}
        value={TaskPresenter.name(task)}
        name='name'
        label='Name'
        required
        margin='dense'
      />
      <TextField
        error={has('description', errors)}
        helperText={errors.description}
        onChange={handleChangeField}
        value={TaskPresenter.description(task)}
        name='description'
        label='Description'
        required
        multiline
        margin='dense'
      />
      {isEditFormType && (
        <UserSelect
          label='Author'
          value={TaskPresenter.author(task)}
          name='author'
          onChange={handleChangeSelect('author')}
          isRequired
          error={has('author', errors)}
          helperText={errors.author}
        />
      )}
      <UserSelect
        label='Assigned to'
        value={TaskPresenter.assignee(task)}
        name='assignee'
        onChange={handleChangeSelect('assignee')}
        isRequired
        error={has('assignee', errors)}
        helperText={errors.author}
      />
      {isNil(TaskPresenter.imageUrl(task)) ? (
        <div className={styles.imageUploadContainer}>
          <ImageUpload onUpload={onAttachImage} />
        </div>
      ) : (
        <div className={styles.previewContainer}>
          <img className={styles.preview} src={TaskPresenter.imageUrl(task)} alt='Attachment' />
          <Button variant='contained' size='small' color='primary' onClick={onRemoveImage}>
            Remove image
          </Button>
        </div>
      )}
    </form>
  );
};

Form.propTypes = {
  onChange: PropTypes.func.isRequired,
  onAttachImage: PropTypes.func.isRequired,
  onRemoveImage: PropTypes.func.isRequired,
  task: TaskPresenter.shape().isRequired,
  type: PropTypes.string,
  errors: PropTypes.shape({
    name: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.arrayOf(PropTypes.string),
    assignee: PropTypes.arrayOf(PropTypes.string)
  })
};

Form.defaultProps = {
  errors: {},
  type: FORM_TYPES.NEW
};

export default Form;
