/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */

class VK {

  static ACCESS_TOKEN = "";
  static lastCallback = {
    callback : (result) => {
      VK.processData(result);
    },
  }


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
  }


  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result) {
    
    if (result.error) {
      alert(result.error.error_msg);
      return;
    }
    if (result.response.items.length == 0) {
      alert("у пользователя нет фото");
      return;
    }
    // В случае возникновения ошибки выводите её в `alert` и завершайте выполнение обработчика ответа от сервера.
    if (!result) {
      alert('Ошибка получения фотографий. Проверьте правильность id');
      return;
    }
    // удалить тег `script`, который добавлялся для выполнения запроса
    const el = document.querySelector('head').querySelector('script');
    el.remove();

    if (VK.lastCallback.arrayPhotos) {
      VK.lastCallback.arrayPhotos = [];
    }

    // Поиск самых крупных изображений из ответа от сервера
    
    const arrayPhoto = result.response.items; // массив фотографий

    let arrayMaxSizePhotos = [];

    arrayPhoto.forEach(element => {
     let url = '';

    const max = element.sizes.reduce(function ( maxValue, currentValue ) {
      maxValue = maxValue > currentValue.height ? maxValue : currentValue.height;
      return maxValue;
    })
  
    url = element.sizes.filter(el => el.height == max)[0].url;
      
    arrayMaxSizePhotos.push(url);
  })

    // передаем изображения в колбек, который передавался в метод `VK.get`, который сохранялся в `lastCallback`.
    VK.lastCallback.arrayPhotos = arrayMaxSizePhotos;
  
  }
}
