import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },

  imageUploadContainer: {
    paddingTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start'
  },

  preview: {
    maxWidth: '100%',
    maxHeight: 300,
    paddingTop: 8,
    paddingBottom: 8
  },

  previewContainer: {
    paddingTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start'
  }
}));

export default useStyles;
