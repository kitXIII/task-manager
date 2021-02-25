import React from 'react';

import store from 'store';
import { Provider } from 'react-redux';

import TaskBoardContainer from 'containers/TaskBoardContainer';
import TaskBoard from 'components/TaskBoard';

const App = () => (
  <Provider store={store}>
    <TaskBoardContainer>
      {({ board, loadBoard, loadColumnMore, handleCardChangeState }) => (
        <TaskBoard
          loadBoard={loadBoard}
          board={board}
          loadColumnMore={loadColumnMore}
          handleCardChangeState={handleCardChangeState}
        />
      )}
    </TaskBoardContainer>
  </Provider>
);

export default App;
