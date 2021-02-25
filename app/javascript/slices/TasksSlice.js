import { propEq } from 'ramda';
import { createSlice } from '@reduxjs/toolkit';
import { changeColumn } from '@lourenci/react-kanban';
import TasksRepository from 'repositories/TasksRepository';
import TaskPresenter, { STATES } from 'presenters/TaskPresenter';
import { useDispatch } from 'react-redux';

const initialState = {
  board: {
    columns: STATES.map((column) => ({
      id: column.key,
      title: column.value,
      cards: [],
      meta: {}
    }))
  }
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadColumnSuccess(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find(propEq('id', columnId));

      state.board = changeColumn(state.board, column, {
        cards: items,
        meta
      });

      return state;
    },
    loadColumnMoreSuccess(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find(propEq('id', columnId));

      state.board = changeColumn(state.board, column, {
        cards: [...column.cards, ...items],
        meta
      });

      return state;
    }
  }
});

const { loadColumnSuccess, loadColumnMoreSuccess } = tasksSlice.actions;

export default tasksSlice.reducer;

export const useTasksActions = () => {
  const dispatch = useDispatch();

  const loadColumn = (state, page = 1, perPage = 10) => {
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage
    }).then(({ data }) => {
      dispatch(loadColumnSuccess({ ...data, columnId: state }));
    });
  };

  const loadBoard = () => STATES.map(({ key }) => loadColumn(key));

  const loadColumnMore = (state, page = 1, perPage = 10) => {
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage
    }).then(({ data }) => {
      dispatch(loadColumnMoreSuccess({ ...data, columnId: state }));
    });
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

  return {
    loadBoard,
    loadColumnMore,
    handleCardChangeState
  };
};
