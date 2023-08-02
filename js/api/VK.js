/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */

class VK {

  static ACCESS_TOKEN = `vk1.a.JYQjnz3ZIrriAYIDGwGg7f9R4ApMhasWUZwbxdzeUehK3oWmpAL8_JE-6jYXl-LbGxTlYTEVjRWawENTVNlZNj9so9gQVLeUS-uxYihBYxQpJm0Qzj6IeuUsSHYMLebhI55GhwI8zEgx1wg7TQbpON-2FigbI_d0tuC4ZB0U-QcsDgK36BSxVvZHvcHe-DvN7X6CNx6rRR66MjfjLNYerw`;
  // static ACCESS_TOKEN = `958eb5d439726565e9333aa30e50e0f937ee432e927f0dbd541c541887d919a7c56f95c04217915c32008`;

  static lastCallback = {
    callback : function (result) {
      VK.processData(result);
    },
    };  //. {count: 4, items: Array(4)}


  /**
   * Получает изображения
   * */
  //Чтобы осуществлять кроссдоменные запросы к API, вы можете использовать протокол JSONP. 
  //Для этого необходимо подключать к документу скрипт с адресом запроса в src. 
  //Запрос должен содержать дополнительный параметр callback c именем функции, которая будет вызвана при получении результата.
  
  static get(id) { 
    (() => {
    // делаем get запрос к VK
      let url = `https://api.vk.com/method/photos.get?owner_id=${id}&access_token=${this.ACCESS_TOKEN}&album_id=profile&v=5.131&photo_sizes=1&callback=VK.lastCallback.callback`;
      const script = document.createElement('SCRIPT');
      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
    })()
  };


  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result) {
    // удалить тег `script`, который добавлялся для выполнения запроса
    const el = document.querySelector('head').querySelector('script');
    el.remove();
  
    // В случае возникновения ошибки выводите её в `alert` и завершайте выполнение обработчика ответа от сервера.
    if (!result) {
      alert('Ошибка получения фотографий. Проверьте правильность id');
      return;
    }

    // if (VK.lastCallback.listFromCallback) {
    //   VK.lastCallback.listFromCallback = [];
    // }
    // Поиск самых крупных изображений из ответа от сервера
    const arrayPhoto = result.response.items; // массив фотографий
    console.log(arrayPhoto)
    let arrayMaxSizePhotos = [];

    arrayPhoto.forEach(element => {
     let url = '';

    const max = element.sizes.reduce(function ( maxValue, currentValue ) {
      maxValue = maxValue > currentValue.height ? maxValue : currentValue.height;
      return maxValue;
      });
  
    url = element.sizes.filter(el => el.height == max)[0].url;
      
    arrayMaxSizePhotos.push(url);
  });

    // передаем изображения в колбек, который передавался в метод `VK.get`, который сохранялся в `lastCallback`.
    VK.lastCallback.arrayPhotos = arrayMaxSizePhotos;
  
    // Обновите свойство `lastCallback` на функцию "пустышку" `() => {}`
    //VK.lastCallback.callbackFn = () => {};


  };
};
