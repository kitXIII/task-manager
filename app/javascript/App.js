import React from 'react';

import store from 'store';
import { Provider } from 'react-redux';

import TaskBoardContainer from 'containers/TaskBoardContainer';
import TaskBoard from 'components/TaskBoard';

const App = () => (
  <Provider store={store}>
    <TaskBoardContainer>
      {({ board, loadBoard, loadColumnMore }) => (
        <TaskBoard loadBoard={loadBoard} board={board} loadColumnMore={loadColumnMore} />
      )}
    </TaskBoardContainer>
  </Provider>
);

export default App;
