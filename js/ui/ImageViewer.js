/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
    this.element = element;
    this.imagesBlock = this.element.querySelector(".images-list .grid .row");
    this.previewBlock = this.element.querySelector(".image");
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents(){

    this.checkButtonText();

    this.imagesBlock.addEventListener("dblclick", (event) => {
      // при двойном клике на изображение, отображается оно в блоке предосмотра
      if (event.target.tagName.toLowerCase() === "img") {
        this.previewBlock.src = event.target.src;
      }
    });

    this.imagesBlock.addEventListener("click", (event) => {

      if (event.target.tagName.toLowerCase() === "img") {
        // Инвертировать наличие класса `selected`
        event.target.classList.toggle("selected");
        // Провертить текст в кнопке "Выбрать всё" / "Снять выделение" и 
        // работоспособность кнопки "Отправить на диск". Для проверки кнопки, используется метод `checkButtonText`
        this.checkButtonText();
      }
        
        // *** Клик по кнопке "Выбрать всё" / "Снять выделение":
      if (event.target.classList.contains("select-all")) {

          // Получает все изображения
          let photos = this.element.querySelectorAll("img");

          // Если во всех изображениях *хотябы одно* изображение имеет класс `selected`, 
          if ( [...photos].filter(c => c.className === "selected").length > 0 ) {
            // то этот класс необходимо удалить для всех изображений.
            photos.forEach(photo => {

              let interval = setInterval(() => {
                photo.classList.remove("selected");
                if ([...photos].filter(c => c.className === "selected").length === 0) {
                  this.checkButtonText();
                  clearInterval(interval);
                };
              }, 0);

            }); 
          }

          // Если ни одно изображение не имеет класс `selected`, то этот класс необходимо добавить для всех изображений.
          else {
            photos.forEach(photo => {
              let interval = setInterval(() => {
                photo.classList.add("selected");
                if ( [...photos].filter(c => c.className === "selected").length === photos.length - 1) {
                  this.checkButtonText();
                  clearInterval(interval);
                };
              }, 0);
            }); 
          };
        };

        // *** Клик по кнопке "Посмотреть загруженные файлы"
        if (event.target.classList.contains( "show-uploaded-files" )) {
          // получаем модальное окно
          const modal = App.getModal("filePreviewer");
          modal.open();
          // отображаем большой лоадер

          const callback = (result) => {
            modal.showImages(result.items);
          };

          Yandex.getUploadedFiles(callback);
        }

        // *** Клик по кнопке "Отправить на диск"
        if (event.target.classList.contains( "send" )) {
          // С помощью метода `App.getModal` получает модальное окно [загрузки изображений]
          const modal = App.getModal("fileUploader");
          // Получите все выделенные изображения (с класом `selected`)
          const photoSelected = [...this.element.querySelectorAll("img")].filter(e => e.className == "selected");
          // Откройте полученное модальное окно (с помощью метода `open`)
          modal.open();
          // Отрисуйте все модальные изображения в открытом модальном окне с помощью метода `showImages` у объекта модального окна
          modal.showImages(photoSelected);
        }

    })
  } 

  /**
   * Очищает отрисованные изображения
   */
  clear() {

    const el = document.querySelector(".images-list .grid .row");
    el.innerHTML = "";
   
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    // Если количество изображений положительное, необходимо удалить класс `disabled` у кнопки "Выбрать всё" / "Снять выделение"
    if (images.length > 0) {
      document.querySelector(".select-all").classList.remove("disabled");
      document.querySelector(".send").classList.remove("disabled");
    }
    // В ином случае (если изображения отсутсвуют), необходимо добавить класс `disabled` кнопке "Выбрать всё" / "Снять выделение"
    else {
      document.querySelector(".select-all").classList.add("disabled");
      document.querySelector(".send").classList.add("disabled");
    }
    // Сформируйте разметку для всех полученных изображений и добавьте сформированную разметку к уже существующей.
    const el = document.querySelector(".images-list .grid .row");
    images.forEach((element) => {
    const newElement = document.createElement('DIV');
    newElement.classList.add( "four", "wide", "column", "ui", "medium", "image-wrapper");
    newElement.innerHTML = `<img src='${element}' />`;
    el.appendChild(newElement);
    })
  }


  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    // Получите все отрисованные изображения
    let photos = this.element.querySelectorAll("img");
    // Получите кнопки с классом `select-all` и `send`
    let buttonSelect = document.querySelector(".select-all");
    let buttonSend = document.querySelector(".send");

    // Если все полученные изображения имеют класс `selected`, то в кнопке `select-all` текст должен быть `"Снять выделение"`. 
    // В ином случае, текст должен быть `"Выбрать всё"`.
    if ( [...photos].filter(c => c.classList.contains("selected")).length === photos.length ) { 

      buttonSelect.textContent = "Снять выделение";
    }
    else {
      buttonSelect.textContent = "Выбрать всё";
    }
    // Если есть хотябы одно изображение с классом `selected`, то в кнопке `send` необхоимо удалить класс `disabled`. 
    // В ином случае, добавляйте класс `disabled`.
    if ([...photos].filter(c => c.className === "selected").length > 0) {
      buttonSend.classList.remove("disabled");
    }
    else {
      buttonSend.classList.add("disabled");
    }
  }
}