import requests from './httpServices';

const SettingServices = {
  //store setting all function
  getOnlineStoreSetting: async () => {
    return requests.get('/setting/store/all');
  },
  //store customization setting all function
  getStoreCustomizationSetting: async () => {
    return requests.get('/setting/store/customization/all');
  },
  getLocalizationSetting: async () => {
    return requests.get(`/setting/localization/all`);
  },
  getAllLanguages: async () => {
    return requests.get(`/language/all`);
  },
  getPosSetting: async () => {
    return requests.get('/setting/pos/all');
  },

  getGlobalSetting: async () => {
    return requests.get('/setting/global/all');
  },

  getAllShipping: async () => {
    return requests.get('/shipping/all');
  },
  getShowingShipping: async () => {
    return requests.get('/shipping/show');
  },
};

export default SettingServices;
