import React, { useEffect, useState } from 'react';
import KanbanBoard from '@lourenci/react-kanban';
import { propOr } from 'ramda';

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import TasksRepository from 'repositories/TasksRepository';

import TaskForm from 'forms/TaskForm';

import AddPopup from 'components/AddPopup';
import ColumnHeader from 'components/ColumnHeader';
import EditPopup from 'components/EditPopup';
import Task from 'components/Task';

import useStyles from './useStyles';

const TASK_STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'In CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' }
];

const MODES = {
  ADD: 'add',
  EDIT: 'edit',
  NONE: 'none'
};

const initialBoard = {
  columns: TASK_STATES.map((column) => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {}
  }))
};

const loadColumn = (taskState, page, perPage) =>
  TasksRepository.index({
    q: { stateEq: taskState },
    page,
    perPage
  });

const TaskBoard = () => {
  const styles = useStyles();

  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState([]);

  const loadColumnInitial = (taskState, page = 1, perPage = 10) => {
    loadColumn(taskState, page, perPage).then(({ data }) => {
      setBoardCards((currentBoardCards) => ({
        ...currentBoardCards,
        [taskState]: { cards: data.items, meta: data.meta }
      }));
    });
  };

  const loadBoard = () => {
    TASK_STATES.map(({ key }) => loadColumnInitial(key));
  };

  const generateBoard = () => {
    setBoard({
      columns: TASK_STATES.map(({ key, value }) => ({
        id: key,
        title: value,
        cards: propOr({}, 'cards', boardCards[key]),
        meta: propOr({}, 'meta', boardCards[key])
      }))
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => loadBoard(), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => generateBoard(), [boardCards]);

  const loadColumnMore = (taskState, page = 1, perPage = 10) => {
    loadColumn(taskState, page, perPage).then(({ data }) => {
      setBoardCards((currentBoardCards) => {
        const cards = currentBoardCards[taskState]?.cards;

        return {
          ...currentBoardCards,
          [taskState]: { cards: [...cards, ...data.items], meta: data.meta }
        };
      });
    });
  };

  const handleCardDragEnd = (task, source, destination) => {
    const transition = task.transitions.find(({ to }) => destination.toColumnId === to);
    if (!transition) {
      return null;
    }

    return TasksRepository.update(task.id, { stateEvent: transition.event })
      .then(() => {
        loadColumnInitial(destination.toColumnId);
        loadColumnInitial(source.fromColumnId);
      })
      .catch((error) => {
        alert(`Move failed! ${error.message}`);
      });
  };

  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);

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

  const handleTaskCreate = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumnInitial(task.state);
      setMode(MODES.NONE);
    });
  };

  const loadTask = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const handleTaskUpdate = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);

    return TasksRepository.update(task.id, attributes).then(() => {
      loadColumnInitial(task.state);
      handleClose();
    });
  };

  const handleTaskDestroy = (task) =>
    TasksRepository.destroy(task.id).then(() => {
      loadColumnInitial(task.state);
      handleClose();
    });

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
          onLoadCard={loadTask}
          onCardDestroy={handleTaskDestroy}
          onCardUpdate={handleTaskUpdate}
          onClose={handleClose}
          cardId={openedTaskId}
        />
      )}
    </>
  );
};

export default TaskBoard;
