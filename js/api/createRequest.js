/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
  (async () => {
    console.log('options',options)
    const way = encodeURIComponent(options.data.way);
    console.log('way',way)
    const urlPhoto = encodeURIComponent(options.data.url);

    // let url = Yandex.HOST + options.path + `?path=${encodeURIComponent(options.data.way)}` + 
    // `&url=${encodeURIComponent(options.data.url)}` + 
    // (options.data.mediaType ? `?media_type=${options.data.mediaType}`
    //         : "") +
    //       (options.data.limit >= 0 ? `&limit=${options.data.limit}` : "");
    // console.log('url',url);

    let response = await fetch(
        
      Yandex.HOST +
      options.path +
      (options.data.way
        ? `?path=${encodeURIComponent(options.data.way)}`
        : "") +
      (options.data.url
        ? `&url=${encodeURIComponent(options.data.url)}`
        : "") +
      (options.data.mediaType
        ? `?media_type=${options.data.mediaType}`
        : "") +
      (options.data.limit >= 0 ? `&limit=${options.data.limit}` : ""),
    {
      method: options.method,
      headers: {
        Authorization: options.headers.Authorization,
      },
    }
        
        
    //     url, {
    //     method: options.metod,
    //     headers: {
    //         Authorization: options.headers.Authorization,
    //     },
    // }
    // );
    )
  

  let result;
  try {
    result = await response.json();
  } 
  catch (syntaxError) {
    result = null;
  }
  if (!response.ok && result !== null) {
    console.log(result.message);
  } else {
    //console.log(result.text)
    return options.callback(result);
  }

})()
}


  


