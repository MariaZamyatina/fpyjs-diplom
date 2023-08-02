//localStorage.clear();
/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken(){
    // Если в локалсторадж нет сохраненного апи яндекс, запрашиваем
    if (!localStorage.hasOwnProperty("yandexToken")) {
      localStorage.setItem(
        "yandexToken",
        prompt("Введите OAUth-токен от Яндекс.Диска")
      );
    }
    return localStorage.getItem("yandexToken");
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback) {
    const token = this.getToken();
    createRequest({
      method: "POST",
      path: "/resources/upload",
      data: { way: path, url: url },
      headers: {
        Authorization: `OAuth ${token}`,
      },
      callback: callback,
    });

  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){
    const token = this.getToken();
    createRequest({
      method: "DELETE",
      path: "/resources",
      data: { way: path, },
      headers: {
        Authorization: `OAuth ${token}`,
      },
      callback: callback, 
    })

  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback) {
    const token = this.getToken();
    return createRequest({
      method: "GET",
      path: "/resources/files",
      data: { mediaType: "image", limit: 100000 },
      headers: {
        Authorization: `OAuth ${token}`,
      },
      callback: callback,
    })
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url){
    console.log('url',url)
    const link = document.createElement("a");
    link.href = url;
    console.log(link);
    document.body.append(link);
    link.click();
    link.remove();
  }
}
