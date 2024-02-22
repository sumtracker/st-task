import axios from "axios";
import config from "../config/config";
import { CONTACT } from "../constants/api.constants";

type ContactApi = {
  query?: Record<string, any>;
  cancelToken:any;
};

export const listContacts = (args?: ContactApi) => {
  let url = config.BACKEND_BASE + CONTACT.LIST;

  let query = args?.query || {};
  return axios.get(url, {
    params: query,
    cancelToken:args?.cancelToken
  });
};
 