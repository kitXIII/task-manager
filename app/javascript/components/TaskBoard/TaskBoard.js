import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import KanbanBoard from '@lourenci/react-kanban';

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import AddPopup from 'components/AddPopup';
import ColumnHeader from 'components/ColumnHeader';
import EditPopup from 'components/EditPopup';
import Task from 'components/Task';

import TaskPresenter from 'presenters/TaskPresenter';

import TasksRepository from 'repositories/TasksRepository';

import TaskForm from 'forms/TaskForm';

import useStyles from './useStyles';

const MODES = {
  ADD: 'add',
  EDIT: 'edit',
  NONE: 'none'
};

const TaskBoard = ({ board, loadBoard, loadColumn, loadColumnMore, changeTask }) => {
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);

  const styles = useStyles();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => loadBoard(), []);

  const handleOpenAddPopup = () => {
    setMode(MODES.ADD);
  };

  const handleOpenEditPopup = (task) => {
    setOpenedTaskId(task.id);
    setMode(MODES.EDIT);
  };

  const handleClose = () => {
    setMode(MODES.NONE);
  };

  const handleCardChangeState = (task, source, destination) => {
    const transition = TaskPresenter.transitions(task).find(({ to }) => destination.toColumnId === to);

    if (!transition) {
      return null;
    }

    return TasksRepository.update(task.id, { stateEvent: transition.event })
      .then(() => Promise.all([loadColumn(destination.toColumnId), loadColumn(source.fromColumnId)]))
      .catch((error) => {
        alert(`Move failed! ${error.message}`);
      });
  };

  const handleTaskCreate = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumn(TaskPresenter.state(task));
      handleClose();
    });
  };

  const handleTaskLoad = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const handleTaskUpdate = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);

    return TasksRepository.update(task.id, attributes).then(() => {
      loadColumn(TaskPresenter.state(task));
      handleClose();
    });
  };

  const handleTaskDestroy = (task) =>
    TasksRepository.destroy(task.id).then(() => {
      loadColumn(TaskPresenter.state(task));
      handleClose();
    });

  const handleTaskAttachImage = (task, attachment) =>
    TasksRepository.attachImage(task.id, attachment).then((res) => {
      if (res?.data?.task) {
        changeTask(res?.data?.task);
      }
    });

  const handleTaskDeleteImage = (task) =>
    TasksRepository.deleteImage(task.id).then((res) => {
      if (res?.data?.task) {
        changeTask(res?.data?.task);
      }
    });

  return (
    <>
      <KanbanBoard
        renderCard={(card) => <Task onClick={handleOpenEditPopup} task={card} />}
        renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
        onCardDragEnd={handleCardChangeState}
        disableColumnDrag
      >
        {board}
      </KanbanBoard>
      <Fab className={styles.addButton} color='primary' aria-label='add'>
        <AddIcon onClick={handleOpenAddPopup} />
      </Fab>
      {mode === MODES.ADD && <AddPopup onCreateCard={handleTaskCreate} onClose={handleClose} />}
      {mode === MODES.EDIT && (
        <EditPopup
          onLoadCard={handleTaskLoad}
          onCardDestroy={handleTaskDestroy}
          onCardUpdate={handleTaskUpdate}
          onCardAttachImage={handleTaskAttachImage}
          onCardDeleteImage={handleTaskDeleteImage}
          onClose={handleClose}
          cardId={openedTaskId}
        />
      )}
    </>
  );
};

TaskBoard.propTypes = {
  loadBoard: PropTypes.func.isRequired,
  loadColumn: PropTypes.func.isRequired,
  loadColumnMore: PropTypes.func.isRequired,
  changeTask: PropTypes.func.isRequired,
  board: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        cards: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
        meta: PropTypes.shape({}).isRequired
      })
    )
  }).isRequired
};

export default TaskBoard;
