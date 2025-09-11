import axios from "axios";
// import { apiUrl } from "./setting";
 const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
// const Authorization = {
//   Authorization: `${BEARER} ${token}`,
// };

export const invokeExternalAPI = async (
  endpoint,
  method,
  body,
  header,
  query
) => {

  const options = {
    method: method,
    url: baseURL+endpoint,
    headers: header,
    params: query,
    data: body,
  };

  if (method === "get") {
    delete options.body;
  }

  let data = null;
  let error = null;

  try {
    const res = await axios(options);
    data = res.data;
    // const res = fetch(u)
  } catch (e) {
    if (e?.response?.statusText !== "") {
      error = e?.response?.statusText;
    }
    error = e.message;
  }

  return { data, error };
};
