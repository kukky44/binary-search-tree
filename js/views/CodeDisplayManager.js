/**
 * Manages the code snippet display
 */
class CodeDisplayManager {
  /**
   * Creates a new code display manager
   */
  constructor() {
    this.codeDisplay = document.getElementById('code-display');
    this.lastLayerIndex = -1;
  }

  /**
   * Sets the html of the code snippet with the current step code highlighted
   * @param {html element as string} snippet html element of the snippet
   */
  setCode(snippet) {
    this.codeDisplay.children[this.lastLayerIndex].innerHTML = snippet;
  }

  /**
   * Clears the code snippet display
   */
  clearCode() {
    this.codeDisplay.innerHTML = '';
    this.lastLayerIndex = -1;
  }

  /**
   * Adds a layer to the code display when a recursive method is called
   */
  addLayer() {
    this.lastLayerIndex++;

    const newLayer = document.createElement('div');
    newLayer.classList.add('code-container', 'code-layer');
    newLayer.style.top = `${this.codeDisplay.children.length * 8}px`;
    this.codeDisplay.append(newLayer);
  }

  removeLayer() {
    this.codeDisplay.children.item(this.lastLayerIndex).classList.add('hide');
    this.lastLayerIndex--;
    // this.codeDisplay.removeChild(this.codeDisplay.lastChild);
  }
}