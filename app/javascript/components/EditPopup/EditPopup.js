import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';

import Form, { FORM_TYPES } from 'components/Form';

import TaskPresenter from 'presenters/TaskPresenter';

import useStyles from './useStyles';

const EditPopup = ({
  cardId,
  onClose,
  onCardDestroy,
  onLoadCard,
  onCardUpdate,
  onCardAttachImage,
  onCardDeleteImage
}) => {
  const [task, setTask] = useState(null);
  const [isSaving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const styles = useStyles();

  useEffect(() => {
    onLoadCard(cardId).then(setTask);
  }, [cardId, onLoadCard]);

  const handleCardUpdate = () => {
    setSaving(true);

    onCardUpdate(task).catch((error) => {
      setSaving(false);
      setErrors(error || {});

      if (error instanceof Error) {
        alert(`Update Failed! Error: ${error.message}`);
      }
    });
  };

  const handleCardDestroy = () => {
    setSaving(true);

    onCardDestroy(task).catch((error) => {
      setSaving(false);

      alert(`Destruction Failed! Error: ${error.message}`);
    });
  };

  const onAttachImage = ({ attachment }) => {
    setSaving(true);

    onCardAttachImage(task, attachment).catch((error) => {
      setSaving(false);

      alert(`Attach image Failed! Error: ${error.message}`);
    });
  };

  const onRemoveImage = () => {
    setSaving(true);

    onCardDeleteImage(task).catch((error) => {
      setSaving(false);

      alert(`Remove image Failed! Error: ${error.message}`);
    });
  };

  const isLoading = isNil(task);

  return (
    <Modal className={styles.modal} open onClose={onClose}>
      <Card className={styles.root}>
        <CardHeader
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
          title={isLoading ? 'Your task is loading. Please be patient.' : TaskPresenter.title(task)}
        />
        <CardContent>
          {isLoading ? (
            <div className={styles.loader}>
              <CircularProgress />
            </div>
          ) : (
            <Form
              errors={errors}
              onChange={setTask}
              task={task}
              type={FORM_TYPES.EDIT}
              onAttachImage={onAttachImage}
              onRemoveImage={onRemoveImage}
            />
          )}
        </CardContent>
        <CardActions className={styles.actions}>
          <Button
            disabled={isLoading || isSaving}
            onClick={handleCardUpdate}
            size='small'
            variant='contained'
            color='primary'
          >
            Update
          </Button>
          <Button
            disabled={isLoading || isSaving}
            onClick={handleCardDestroy}
            size='small'
            variant='contained'
            color='secondary'
          >
            Destroy
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

EditPopup.propTypes = {
  cardId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onCardDestroy: PropTypes.func.isRequired,
  onLoadCard: PropTypes.func.isRequired,
  onCardUpdate: PropTypes.func.isRequired,
  onCardAttachImage: PropTypes.func.isRequired,
  onCardDeleteImage: PropTypes.func.isRequired
};

export default EditPopup;
