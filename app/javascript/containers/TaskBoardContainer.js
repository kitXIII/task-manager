// eslint-disable-next-line filenames/match-exported
import { useSelector } from 'react-redux';
import { useTasksActions } from 'slices/TasksSlice';

const TaskBoardContainer = (props) => {
  const { children } = props;
  const board = useSelector((state) => state.TasksSlice.board);

  const { loadBoard, loadColumnMore, loadColumn, changeTask } = useTasksActions();

  return children({
    board,
    loadBoard,
    loadColumn,
    loadColumnMore,
    changeTask
  });
};

export default TaskBoardContainer;
