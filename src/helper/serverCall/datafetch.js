import { baseurl } from "@/config/setting";

export async function getCategories() {
    const res = await fetch(baseurl+`/categories`)
    const data = await res.json();
    return data
  }


import axios from "axios";

export const serverMethod = async (endpint, params) => {
    const option = {
      method: params.method,
      url: baseurl + endpint,
      headers: {
        ...params.header,
      },
      params: params?.query,
      data: params?.data,
    };
    let response;
    let error;
    try {
      response = await axios.request(option);
    } catch (e) {
      error = e.response;
    }
    return response?.data ? response?.data : error;
  };