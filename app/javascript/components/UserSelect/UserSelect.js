import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { always } from 'ramda';

import AsyncSelect from 'react-select/async';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import InputLabel from '@material-ui/core/InputLabel';

import UsersRepository from 'repositories/UsersRepository';

import UserPresenter from 'presenters/UserPresenter';

import useStyles from './useStyles';

const noop = always();

const UserSelect = ({ error, label, isClearable, isDisabled, isRequired, onChange, value, helperText }) => {
  const [isFocused, setFocus] = useState(false);
  const styles = useStyles();
  const handleLoadOptions = (inputValue) =>
    UsersRepository.index({ q: { firstNameOrLastNameCont: inputValue } }).then(({ data }) => data.items);

  return (
    <>
      <FormControl margin='dense' disabled={isDisabled} focused={isFocused} error={error} required={isRequired}>
        <InputLabel shrink>{label}</InputLabel>
        <div className={styles.select}>
          <AsyncSelect
            cacheOptions
            loadOptions={handleLoadOptions}
            defaultOptions
            getOptionLabel={UserPresenter.fullName}
            getOptionValue={UserPresenter.id}
            isDisabled={isDisabled}
            isClearable={isClearable}
            defaultValue={value}
            onChange={onChange}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </>
  );
};

UserSelect.propTypes = {
  error: PropTypes.bool,
  label: PropTypes.string.isRequired,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func,
  value: UserPresenter.shape(),
  helperText: PropTypes.string
};

UserSelect.defaultProps = {
  value: null,
  error: false,
  isClearable: false,
  isDisabled: false,
  isRequired: false,
  onChange: noop,
  helperText: ''
};

export default UserSelect;
