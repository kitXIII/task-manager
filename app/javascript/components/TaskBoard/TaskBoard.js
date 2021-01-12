import React, { useEffect, useState, useCallback } from 'react';
import KanbanBoard from '@lourenci/react-kanban';
import { propOr } from 'ramda';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import TasksRepository from 'repositories/TasksRepository';

import TaskForm from 'forms/TaskForm';

import Task from 'components/Task';
import ColumnHeader from 'components/ColumnHeader';
import AddPopup from 'components/AddPopup';

import useStyles from './useStyles';

const STATES = [
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
  NONE: 'none'
};

const initialBoard = {
  columns: STATES.map((column) => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {}
  }))
};

const loadColumn = (state, page, perPage) =>
  TasksRepository.index({
    q: { stateEq: state },
    page,
    perPage
  });

const TaskBoard = () => {
  const styles = useStyles();

  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState([]);

  const loadColumnInitial = useCallback((state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => ({
        ...prevState,
        [state]: { cards: data.items, meta: data.meta }
      }));
    });
  }, []);

  const loadBoard = useCallback(() => {
    STATES.map(({ key }) => loadColumnInitial(key));
  }, [loadColumnInitial]);

  const generateBoard = useCallback(() => {
    setBoard({
      columns: STATES.map(({ key, value }) => ({
        id: key,
        title: value,
        cards: propOr({}, 'cards', boardCards[key]),
        meta: propOr({}, 'meta', boardCards[key])
      }))
    });
  }, [boardCards]);

  useEffect(() => loadBoard(), [loadBoard]);
  useEffect(() => generateBoard(), [generateBoard]);

  const loadColumnMore = useCallback(
    (state, page = 1, perPage = 10) => {
      loadColumn(state, page, perPage).then(({ data }) => {
        const cards = boardCards[state]?.cards;

        setBoardCards((prevState) => ({
          ...prevState,
          [state]: { cards: [...cards, ...data.items], meta: data.meta }
        }));
      });
    },
    [boardCards]
  );

  const renderCard = useCallback((card) => <Task task={card} />, []);
  const renderColumnHeader = useCallback((column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />, [
    loadColumnMore
  ]);

  const handleCardDragEnd = useCallback(
    (task, source, destination) => {
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
          // eslint-disable-next-line no-alert
          alert(`Move failed! ${error.message}`);
        });
    },
    [loadColumnInitial]
  );

  const [mode, setMode] = useState(MODES.NONE);

  const handleOpenAddPopup = () => {
    setMode(MODES.ADD);
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

  return (
    <>
      <KanbanBoard
        renderCard={renderCard}
        renderColumnHeader={renderColumnHeader}
        onCardDragEnd={handleCardDragEnd}
        disableColumnDrag
      >
        {board}
      </KanbanBoard>
      <Fab className={styles.addButton} color='primary' aria-label='add'>
        <AddIcon onClick={handleOpenAddPopup} />
      </Fab>
      {mode === MODES.ADD && <AddPopup onCreateCard={handleTaskCreate} onClose={handleClose} />}
    </>
  );
};

export default TaskBoard;
