import React from 'react';
import store from 'store';
import { Provider } from 'react-redux';

import TaskBoardContainer from 'containers/TaskBoardContainer';
import TaskBoard from 'components/TaskBoard';

import 'react-image-crop/dist/ReactCrop.css';

const App = () => (
  <Provider store={store}>
    <TaskBoardContainer>
      {({ board, loadBoard, loadColumn, loadColumnMore, changeTask }) => (
        <TaskBoard
          loadBoard={loadBoard}
          board={board}
          loadColumn={loadColumn}
          loadColumnMore={loadColumnMore}
          changeTask={changeTask}
        />
      )}
    </TaskBoardContainer>
  </Provider>
);

export default App;
