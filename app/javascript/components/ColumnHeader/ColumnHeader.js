import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

import useStyles from './useStyles';

const ColumnHeader = ({ column, onLoadMore }) => {
  const styles = useStyles();

  const {
    id,
    title,
    cards,
    meta: { totalCount, currentPage }
  } = column;

  const count = cards.length;

  const handleLoadMore = useCallback(() => onLoadMore(id, currentPage + 1), [currentPage, id, onLoadMore]);

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <b>{title}</b> ({count}/{totalCount || '…'})
      </div>
      <div className={styles.actions}>
        {count < totalCount && (
          <IconButton aria-label='Load more' onClick={handleLoadMore}>
            <SystemUpdateAltIcon fontSize='small' />
          </IconButton>
        )}
      </div>
    </div>
  );
};

ColumnHeader.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    meta: PropTypes.shape().isRequired
  }).isRequired,
  onLoadMore: PropTypes.func.isRequired
};

export default ColumnHeader;
