/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor( element ) {
    this.element = element;
    this.registerEvents();
  }
  
  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents(){

    this.element.addEventListener('click', function(event) {

      // если нажата кнопка добавить
      if (event.target.classList.contains("add")) {

        const input = event.target.closest('div.search-block').children[0].value;
      
        if (!input.trim()) {
          alert('Введите id пользователя');
          return;
        }
        
        // Выполняем запрос на сервер для получения изображений
        SearchBlock.addPhotos(input);
      }
      // ели нажата кнопка заменить
      if (event.target.classList.contains("replace")) {

        const input = event.target.closest('div.search-block').children[0].value;
      
        if (!input.trim()) {
          alert('Введите id пользователя');
          return;
        }

        // удаляем отрисованные изображения  
        ImageViewer.clear(); 
        // Выполняем запрос на сервер для получения изображений
        SearchBlock.addPhotos(input);
      }
  })
  
}

  static addPhotos(input) {
    (() => {
  // Выполняем запрос на сервер для получения изображени
  VK.get(input);

  let interval = setInterval(() => {
    if (VK.lastCallback.arrayPhotos) {
      ImageViewer.drawImages(VK.lastCallback.arrayPhotos);
      clearInterval(interval);
    }
  }, 0);
})();
};

}
    


// 710698165