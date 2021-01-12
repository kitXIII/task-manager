import React, { useEffect, useState, useCallback } from 'react';
import KanbanBoard from '@lourenci/react-kanban';
import { propOr } from 'ramda';

// import Task from 'components/Task';
import TasksRepository from 'repositories/TasksRepository';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' }
];

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

  return <KanbanBoard disableColumnDrag>{board}</KanbanBoard>;
};

export default TaskBoard;
