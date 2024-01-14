import axios from "axios";
import config from "../config/config";
import { CONTACT } from "../constants/backend.constants";
const cancelTokenSource = axios.CancelToken.source();

type ContactApi = {
  query?: Record<string, any>;
  cancelToken:any;
};

const listContacts = (args?: ContactApi) => {
  let url = config.BACKEND_BASE + CONTACT.LIST;

  let query = args?.query || {};
  return axios.get(url, {
    params: query,
    cancelToken:args?.cancelToken
  });
};

export { listContacts };
 