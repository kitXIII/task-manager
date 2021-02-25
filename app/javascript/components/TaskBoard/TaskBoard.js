import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import KanbanBoard from '@lourenci/react-kanban';

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import AddPopup from 'components/AddPopup';
import ColumnHeader from 'components/ColumnHeader';
import EditPopup from 'components/EditPopup';
import Task from 'components/Task';

import useStyles from './useStyles';

const MODES = {
  ADD: 'add',
  EDIT: 'edit',
  NONE: 'none'
};

const TaskBoard = ({ board, loadBoard }) => {
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);

  const styles = useStyles();

  useEffect(() => loadBoard(), [loadBoard]);

  const loadColumnMore = () => {};
  const handleCardDragEnd = () => {};
  const handleTaskCreate = () => {};
  const handleTaskLoad = () => {};
  const handleTaskUpdate = () => {};
  const handleTaskDestroy = () => {};

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

  return (
    <>
      <KanbanBoard
        renderCard={(card) => <Task onClick={handleOpenEditPopup} task={card} />}
        renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
        onCardDragEnd={handleCardDragEnd}
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
          onClose={handleClose}
          cardId={openedTaskId}
        />
      )}
    </>
  );
};

TaskBoard.propTypes = {
  loadBoard: PropTypes.func.isRequired,
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
