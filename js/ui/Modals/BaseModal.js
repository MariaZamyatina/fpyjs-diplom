/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor( element ) {
    this.domElement = element[0];
    this.semanticElement = element;

  }

  /**
   * Открывает всплывающее окно
   * Метод `open`, который вызывает метод `modal` на семантик элементе. Аргументом передаётся `'show'`
   */
  open() {
    // Для инициализации модального окна используется метод $.fn.modal
    // $('.ui.modal').modal({
    $(`.ui.modal.${this.domElement.classList[2]}`).modal("show");
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    // Метод `close`, который вызывает метод `modal` на семантик элементе. Аргументом передаётся `'hide'`.
    $(`.ui.modal.${this.domElement.classList[2]}`).modal("hide");
  }
}