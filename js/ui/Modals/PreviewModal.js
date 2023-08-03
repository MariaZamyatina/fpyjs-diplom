/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor(element) {
    super(element);
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    
    this.domElement.addEventListener("click", (event) => {
      
      // Клик по крестику на всплывающем окне, закрывает его
      if (event.target == this.domElement.querySelector("i")) {
        this.close();
      };
      // Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
      if (event.target.classList.contains("close")) {
        this.close();
      };
      // Клик по контроллерам изображения: 
      // * Отправляет запрос на удаление изображения, если клик был на кнопке delete
      // * Скачивает изображение, если клик был на кнопке download
      if (event.target.classList.contains("delete")) {

        const i = event.target.querySelector("i");
        i.className = "icon spinner loading";
        event.target.classList.add("disabled");
        // запрос на удаление файла (с помощью метода `Yandex.removeFile`)
        const path = event.target.getAttribute("data-path");
        let callback = (result) => {
          if (result === null) {
          // удаляем весь блок с информацией об изображении
          event.target.closest(".image-preview-container").remove();
          }
        }
        Yandex.removeFile(path, callback);
      }

      if (event.target.classList.contains("download")) {
        
        const url = event.target.getAttribute("data-file");
        Yandex.downloadFileByUrl(url);
        
      }
    })

    this.domElement.querySelector(".content").addEventListener("click", (event) => {
      
    })

  }


  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {

    const arrayHtml = [];
    data.forEach(item => {
      const html = this.getImageInfo(item);
      arrayHtml.push(html);
    });
    const container = this.domElement.querySelector(".content");
    container.innerHTML = arrayHtml.join("");

  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    let newDate = new Date(date);

    const months = {1: "января", 2: "февраля", 3: "марта", 4: "апреля", 5: "мая", 6: "июня", 
    7: "июля", 8: "августа", 9: "сентября", 10: "октября", 11: "ноября", 12: "декабря",};

    const str = newDate.getDate() + " " + months[newDate.getUTCMonth()] + " " + newDate.getFullYear() +  " г. в " + 
    newDate.getHours() + ":" + newDate.getMinutes();
    return str;
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {

    const size = (Math.round((Number(item.size) / 1024) * 100) / 100).toFixed(2);
    const html = `
    <div class="image-preview-container">
  <img src='${item.file}' />
  <table class="ui celled table">
  <thead>
    <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
  </thead>
  <tbody>
    <tr><td>${item.name}</td><td>${this.formatDate(item.created)}</td><td>${size}Кб</td></tr>
  </tbody>
  </table>
  <div class="buttons-wrapper">
    <button class="ui labeled icon red basic button delete" data-path='${item.path}'>
      Удалить
      <i class="trash icon"></i>
    </button>
    <button class="ui labeled icon violet basic button download" data-file='${item.file}'>
      Скачать
      <i class="download icon"></i>
    </button>
  </div>
</div>`;
  return html;
  }
}
