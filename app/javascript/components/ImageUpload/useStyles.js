import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  crop: {
    maxHeight: 300,
    maxWidth: 300,
    overflow: 'auto',
    marginBottom: 8
  }
}));

export default useStyles;
