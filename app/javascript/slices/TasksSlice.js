import { propEq } from 'ramda';
import { createSlice } from '@reduxjs/toolkit';
import { changeColumn } from '@lourenci/react-kanban';
import TasksRepository from 'repositories/TasksRepository';
import { STATES } from 'presenters/TaskPresenter';
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
    },
    changeCard(state, { payload }) {
      const { card } = payload;
      const column = state.board.columns.find(propEq('id', card.state));

      const { cards } = column;
      const cardIndex = cards.findIndex((c) => c.id === card.id);

      if (cardIndex === -1) {
        return state;
      }

      const items = [...cards.slice(0, cardIndex), card, ...cards.slice(cardIndex + 1)];

      state.board = changeColumn(state.board, column, {
        cards: items
      });

      return state;
    }
  }
});

const { loadColumnSuccess, loadColumnMoreSuccess, changeCard } = tasksSlice.actions;

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

  const changeTask = (card) => dispatch(changeCard({ card }));

  return {
    loadBoard,
    loadColumn,
    loadColumnMore,
    changeTask
  };
};
