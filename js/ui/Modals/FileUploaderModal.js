/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents(){
    this.domElement.addEventListener("click", (event) => {
      
      // Клик по крестику на всплывающем окне, закрывает его
      if (event.target == this.domElement.querySelector("i")) {
        this.close();
      }
      // Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
      if (event.target.classList.contains("close")) {
        this.close();
      }
      // Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
      if (event.target.classList.contains("send-all")) {
        const images = this.domElement.querySelector(".content").querySelectorAll(".image-preview-container");
        this.sendAllImages(images);
      }
    })

      // Так как мы изначально не знаем сколько элементов изображений будет отображаться в модалке 
      // (сколько полей ввода и кнопок будет), то добавим обработчик события на весь блок тела модалки (с классом `content`)
    this.domElement.querySelector(".content").addEventListener("click", (event) => {  
        // Если клик был на элементе с классом `input`, то необходимо удалить класс `error` у этого блока.
      if (event.target.classList.contains("input")) {
        event.target.classList.remove("error");
      }
        // Если клик был на кнопке отправки, то необходимо вызывать класс `sendImage` 
        // и передавать весь блок контейнер изображения (из которого будем получать исходный путь 
        // изображения для загрузки и путь куда необходимо загружать изображение (из поля ввода)).
        if (event.target.classList.contains("upload")) {
          const imageContainer = event.target.closest(".image-preview-container");
          this.sendImage(imageContainer);
        }
    })
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    images.reverse();

    const arrayHtml = [];
    // Для каждого изображения получаем блок контейнер (с изображением, полем ввода и кнопкной загрузки).
    images.forEach(image => {
      const html = this.getImageHTML(image);
      arrayHtml.push(html);
    })

    const container = this.domElement.querySelector(".content");
    container.innerHTML = arrayHtml.join("")

  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    const html = `<div class="image-preview-container">
    <img src='${item.src}' />
    <div class="ui action input">
      <input type="text" placeholder="Путь к файлу">
      <button class="ui button"><i class="upload icon"></i></button>
    </div>
  </div>`
  return html;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages(images) {
    images.forEach(image => {
      this.sendImage(image);  
    })
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    // Получает значение поля ввода и валидирует строку пути для загрузки изображения.
    const input = imageContainer.querySelector("input").value.trim();
    // Если поле ввода пустое, то необходимо добавить класс `error` блоку с классом `input` 
    if (!input) {
      imageContainer.querySelector("div.input").classList.add("error");
      return;
    }
    // Добавьте класс `disabled` семантик элементу поля ввода (блоку с классом `input`). 
    imageContainer.querySelector("i").classList.add("disabled");
    // Получите путь добавляемого изображения
    const src = imageContainer.querySelector("img").src;
    // Выполните запрос на отправку изображения
   
    // После выполнения запроса (в колбеке) выполняйте следующие действия:
    // 1. Удалите блок контейнер добавленного изображения.
    // 2. Если не осталось никаких изображений в модалке, то закрывайте модальное окно.
    let callback = () => {
      imageContainer.remove();
      if (document.querySelector(".file-uploader-modal .content").children.length === 0) {
        this.close();
      } 
    }

    Yandex.uploadFile(input, src, callback);

  }
}