/**
 * Manages the code snippet display
 */
class CodeDisplayManager {
  /**
   * Creates a new code display manager
   */
  constructor() {
    this.codeDisplay = document.getElementById('code-display');
  }

  /**
   * Sets the html of the code snippet with the current step code highlighted
   * @param {html element as string} snippet html element of the snippet
   */
  setCode(snippet) {
    this.codeDisplay.innerHTML = snippet;
  }

  /**
   * Clears the code snippet display
   */
  clearCode() {
    this.codeDisplay.innerHTML = '';
  }
}