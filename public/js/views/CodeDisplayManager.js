/**
 * Manages the code snippet display
 * updating the code snippet display when a step is made
 * add or remove layers depending on the operation
 */
class CodeDisplayManager {
  /**
   * Creates a new code display manager
   * @constructor
   */
  constructor() {
    this.codeDisplay = document.getElementById('code-display');
    this.lastLayerIndex = -1;
  }

  /**
   * Sets the html of the code snippet with the current step code highlighted
   * @param {string} snippet html element of the snippet as string
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
   * @param {Object} flags - The flags for the operation for diffrent types of operations
   */
  addLayer(flags) {
    const newLayer = document.createElement('div');
    newLayer.classList.add('code-container', 'code-layer');
    if (flags.isPrev) newLayer.classList.add('prev');
    if (flags.isTemp) newLayer.classList.add('temp');
    newLayer.style.top = `${this.codeDisplay.children.length * 8}px`;
    this.codeDisplay.append(newLayer);
    this.lastLayerIndex++;
  }

  /**
   * Removes a layer from the code display when a recursive method is finished
   * @param {Object} flags - The flags for the operation for manage pause (to prevent adding layers while removing)
   */
  removeLayer(flags) {
    const child = this.codeDisplay.children.item(this.lastLayerIndex);
    if(!child) return;
    flags.pause = true;
    this.lastLayerIndex--;

    // if the operation is a previous operation, remove the layer immediately
    if(flags.isPrev) {
      child.remove();
      flags.pause = false;
    } else {
      // if the operation is a temp operation, hide the layer and remove it after 500ms to animate slide out
      child.classList.add('hide');
      setTimeout(() => {
        child.remove();
        flags.pause = false;
      }, "500");
    }
  }
}