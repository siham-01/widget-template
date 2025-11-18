/**
 * Base class for widget elements on a widget page.
 * Provides common functionality and interface for all widgets.
 * @class
 */
export class Widget {
  /**
   * Create an instance of a Widget.
   * @param {HTMLElement} container - The container element for this widget
   * @param {WidgetPage} page - The page that contains this widget
   */
  constructor(container, page) {
    this.container = container;
    this.page = page;
  }

  /**
   * Called when the window is resized.
   * Override this method in subclasses to handle resize events.
   */
  onResize() {
    return;
  }
}