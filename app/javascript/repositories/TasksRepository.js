import routes from 'routes';
import FetchHelper from 'utils/fetchHelper';
import fetchHelper from '../utils/fetchHelper';

export default {
  index(params) {
    const path = routes.apiV1TasksPath();
    return FetchHelper.get(path, params);
  },

  show(id) {
    const path = routes.apiV1TaskPath(id);
    return FetchHelper.get(path);
  },

  create(task = {}) {
    const path = routes.apiV1TasksPath();
    return FetchHelper.post(path, { task });
  },

  update(id, task = {}) {
    const path = routes.apiV1TaskPath(id);
    return FetchHelper.put(path, { task });
  },

  destroy(id) {
    const path = routes.apiV1TaskPath(id);
    return FetchHelper.delete(path);
  },

  attachImage(id, { attachment }) {
    const path = routes.attachImageApiV1TaskPath(id);
    return fetchHelper.putFormData(path, { attachment });
  },

  deleteImage(id) {
    const path = routes.removeImageApiV1TaskPath(id);
    return FetchHelper.put(path, {});
  }
};
