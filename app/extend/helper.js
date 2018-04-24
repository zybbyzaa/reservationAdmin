'use strict';

module.exports = {
  returnJson(code, msg, data = null) {
    return {
      code,
      msg,
      data,
    };
  },
  getQueryParams(attributes, params) {
    const { pageNum, pageSize, ...query } = params;
    const queryParams = {
      attributes,
    };
    if (pageSize) {
      qureyParams.limit = pageSize;
    }
    if (pageNum) {
      qureyParams.offset = (pageNum - 1) * pageSize;
    }
    if (query) {
      queryParams.where = query;
    }
    return queryParams;
  },
};
