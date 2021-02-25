// eslint-disable-next-line filenames/match-exported
import { useSelector } from 'react-redux';
import { useTasksActions } from 'slices/TasksSlice';

const TaskBoardContainer = (props) => {
  const { children } = props;
  const board = useSelector((state) => state.TasksSlice.board);

  const { loadBoard, loadColumnMore } = useTasksActions();

  return children({
    board,
    loadBoard,
    loadColumnMore
  });
};

export default TaskBoardContainer;
