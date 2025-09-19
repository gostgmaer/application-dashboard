import { log } from "console";
import Cookies from "js-cookie";
// import XLSX from "xlsx";
import moment from "moment";
// Export the calculateTimeGap function with maxGap parameter
export function calculateTimeGap(date1, date2, maxGap) {
  const momentDate1 = moment(date1, "YYYY-MM-DD HH:mm:ss");
  const momentDate2 = date2 ? moment(date2, "YYYY-MM-DD HH:mm:ss") : moment();

  // Calculate the time gap duration
  const duration = moment.duration(momentDate2.diff(momentDate1));

  // Calculate the years and months in the duration
  const years = duration.years();
  const months = duration.months();

  // Check if the duration exceeds the maximum allowable time gap in months
  if (duration.asMonths() > maxGap) {
    return `Time Gap exceeds the maximum allowable (${maxGap} months)`;
  }

  // Format the duration based on the maxGap value
  let formattedDuration = "";
  if (years > 0) {
    formattedDuration += `${years} year${years > 1 ? "s" : ""}`;
  }
  if (months > 0) {
    if (formattedDuration) {
      formattedDuration += " ";
    }
    formattedDuration += `${months} month${months > 1 ? "s" : ""}`;
  }

  return `${formattedDuration}`;
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const findIndex = (array, index) => {
  const found = array.find(function (element, ind) {
    return index === ind;
  });
  return found;
};

// export const arrayGroupbykey = (array, key) => {
//   const uniqueCategories = [...new Set(array.map((item) => item[key]))];
//   function filterByCategory(array, key) {
//     return array.filter((item) => item.category === key);
//   }
//   const filteredArrays = [];
//   uniqueCategories.forEach((key) => {
//     const filteredArray = filterByCategory(array, key);
//     filteredArrays.push(filteredArray);
//   });

//   return filteredArrays;
// };

export const setToken = (name, value, days, type) => {
  if (type === "ACCESS_TOKEN") {
    const token = value.split(".");
    setClientCookie("headerPayload", `${token[0]}.${token[1]}`, days);
    setClientCookie("signature", `${token[2]}`, days);
  } else {
    setClientCookie(name, value, days);
  }
};


export const setClientCookie = (name, value, timestamp) => {
  const expirationDate = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  Cookies.set(name, value, { expires: expirationDate });
};


export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/-+/g, "-") // Replace consecutive hyphens with a single hyphen
    .substring(0, 50); // Limit length to 50 characters
};


export function generateUrlFromNestedObject(nestedObject) {
  const queryParams = [];

  const processNestedObject = (obj, prefix = '') => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (typeof value === 'object' && value !== null) {
          processNestedObject(value, prefix + key + '.');
        } else {
          queryParams.push(`${encodeURIComponent(prefix + key)}=${encodeURIComponent(value)}`);
        }
      }
    }
  };

  processNestedObject(nestedObject);

  if (queryParams.length > 0) {
    return '?' + queryParams.join('&');
  } else {
    return '';
  }
}

export function parseUrlWithQueryParams(url) {
  const queryString = url.split('?')[1];
  if (!queryString) {
    return {};
  }

  const params = new URLSearchParams(queryString);
  const nestedObject = {};

  params.forEach((value, key) => {
    const keys = key.split('.');
    let currentLevel = nestedObject;

    for (let i = 0; i < keys.length - 1; i++) {
      currentLevel[keys[i]] = currentLevel[keys[i]] || {};
      currentLevel = currentLevel[keys[i]];
    }

    // Check for empty or undefined values before decoding
    const decodedValue = value === 'undefined' ? undefined : decodeURIComponent(value);
    currentLevel[keys[keys.length - 1]] = decodedValue;
  });

  return nestedObject;
}

export function storeCookiesOfObject(data,exp) {
  console.log("Storing cookies for data:", data);
  
  if (data) {
    const userKeys = Object.keys(data);

    userKeys.forEach(key => {
      console.info(`Setting cookie for key: ${key}, value: ${data[key]}`);
      const value = data[key];
      Cookies.set(key, value,exp);
    });
  }
}


// export const exportData = (data, filename) => {
//   const worksheet = XLSX.utils.json_to_sheet(data);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//   return XLSX.writeFile(workbook, `${filename}_${Date.now()}.xlsx`);
// };


// export const exportExcelFile = (data, columnobj, filename) => {

//   var xlsdata = [];

//   xlsdata = data.map(item => {
//     const newItem = {};
//     for (const key in columnobj) {
//       newItem[columnobj[key]] = item[key];
//     }
//     return newItem;
//   });


//   exportData(xlsdata, filename);

// }

type SortParams = {
  sortBy?: string;
  sortDesc?: boolean | string;
};


export function transformSortParams(params: SortParams): string | undefined {
  const { sortBy, sortDesc } = params;
  if (!sortBy) return undefined;
  const direction = String(sortDesc).toLowerCase() === "true" ? "desc" : "asc";
  return `${sortBy}:${direction}`;
}



export function removeKeysFromObject(obj:any, keysToRemove:any) {
  const newObj = { ...obj }; // clone to avoid mutating original
  keysToRemove.forEach((key:string) => {
    delete newObj[key];
  });
  return newObj;
}