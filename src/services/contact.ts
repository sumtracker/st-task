import axios from "axios";
import config from "../config/config";
import { CONTACT } from "../constants/backend.constants";

type ListContactApi = {
  query?: Record<string, any>;
  url?: string; //allows passing a full URL for pagination
};

const listContacts = ({ query = {}, url }: ListContactApi = {}) => {
  //use the provided url for pagination, or construct one for initial load
  const endpoint = url || `${config.BACKEND_BASE}${CONTACT.LIST}`;
  return axios.get(endpoint, {
    params: query,
  });
};

export { listContacts };