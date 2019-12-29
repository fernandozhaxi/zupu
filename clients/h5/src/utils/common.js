/**
 *判断变量类型
 * @param target 需要判断类型的变量
 * @param type 期望的类型，如Funtion, Array
 * 如果只传target，会返回变量d的类型,如Function，Array
 * 如果还传了type，会返回布尔值，表示变量target的类型是否是type
 */
export const isType = function(target, type) {
  const class2type = {};

  return type && typeof t === 'string' ?
    class2type.toString.call(target) ===
        `[object ${type.replace(/^(\w)/, a => {
          return a.toUpperCase();
        })}]` :
    class2type.toString.call(target).replace(/.+(?=\s)\s|]/g, '');
};

/**
 * 文件下载
 * @param {*} data 文件的内容
 * @param {*} fileName 文件名
 * @param {*} type 文件类型
 */
export const download = function(data, fileName, type) {
  if (!data) {
    return false;
  }
  const types = {
    jpg: 'image/jpg'
  };
  const ndata = new Blob([data], {
    type: isType(type, 'undefined') ? 'text/plain' : types[type] || type
  });

  console.error(ndata);
  const oa = document.createElement('a');

  oa.download = fileName || '未命名文件';
  oa.style.display = 'none';
  oa.href =
    isType(data, 'string') &&
    (data.indexOf('//') > -1 || data.indexOf('/') === 0) ?
      data :
      URL.createObjectURL(ndata);
  document.body.appendChild(oa);
  //   oa.click();
  setTimeout(function() {
    document.body.removeChild(oa);
  });
};

// 获取用户cookie信息
export const getCookie = function(key) {
  const reg = new RegExp(`${key}=([^$;]*)`);
  const result = reg.exec(document.cookie);

  return result && result.length ? result[1] : result;
};
