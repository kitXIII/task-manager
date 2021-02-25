import React from 'react';

import store from 'store';
import { Provider } from 'react-redux';

import TaskBoardContainer from 'containers/TaskBoardContainer';
import TaskBoard from 'components/TaskBoard';

const App = () => (
  <Provider store={store}>
    <TaskBoardContainer>
      {({ board, loadBoard }) => <TaskBoard loadBoard={loadBoard} board={board} />}
    </TaskBoardContainer>
  </Provider>
);

export default App;
