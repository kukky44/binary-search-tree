/**
 * Controlls the UI of the view
 */
class UIController {
  /**
   * Creates a new UI controller
   */
  constructor() {
    this.stepDescDiv = document.getElementById('step-description');
    this.nextBtn = document.getElementById('next-btn');
    this.prevBtn = document.getElementById('prev-btn');
    this.addBtn = document.querySelectorAll('.add-btn');
    this.removeBtn = document.querySelectorAll('.remove-btn')
    this.codeDisplay = document.getElementById('code-display');
    this.rsStacks = document.getElementById('rs-stacks');

    this.rsStacks.addEventListener('click', (e) => {
      if (e.target.classList.contains('stack-switch-btn')) {
        for(const item of this.rsStacks.children) {
          item.classList.remove('active');
        }

        e.target.classList.add('active');

        const clickedIndex = Array.from(this.rsStacks.children).indexOf(e.target);
        this.currentSwitchFunc(clickedIndex);
      }
    });

    this.currentSwitchFunc = null;
  }

  insertRsItem = (switchFunc) => {
    this.currentSwitchFunc = switchFunc;

    const newItem = document.createElement('button');
    const index = this.rsStacks.children.length;
    newItem.textContent = index;

    // deactivate all buttons to set the new item active
    for(const item of this.rsStacks.children) {
      item.classList.remove('active');
    }

    newItem.className = 'stack-switch-btn active';
    this.rsStacks.prepend(newItem);
  }

  popRsItem() {
    this.rsStacks.removeChild(this.rsStacks.firstElementChild);
    this.rsStacks.firstElementChild.classList.add('active');
  }

  clearRsItems() {
    this.rsStacks.innerHTML = '';
  }

  /**
   * Sets the description text for the current operation step
   * @param {string} value - The description of the current step
   */
  setStepDesc(value) {
    this.stepDescDiv.textContent = value;
  }

  /**
   * Displays the step description
   */
  showStepDesc() {
    this.stepDescDiv.classList.add('show');
  }

  /**
   * Hides the step description
   */
  hideStepDesc() {
    this.stepDescDiv.classList.remove('show');
  }

  /**
   * Enables the next step button
   */
  enableNextBtn() {
    this.nextBtn.disabled = false;
  }

  disablePrevBtn() {
    this.prevBtn.disabled = true;
  }

  /**
   * Disables step buttons
   */
  disableStepBtns() {
    this.nextBtn.disabled = true;
    this.prevBtn.disabled = true;
  }

  /**
   * Enables step buttons
   */
  enableStepBtns() {
    this.nextBtn.disabled = false;
    this.prevBtn.disabled = false;
  }

  /**
   * Enables operation buttons (add and remove)
   */
  enableOperationBtns() {
    this.addBtn.forEach(btn => btn.disabled = false);
    this.removeBtn.forEach(btn => btn.disabled = false);
  }

  /**
   * Disables operations buttons (add and remove)
   */
  disableOperationsBtns() {
    this.addBtn.forEach(btn => btn.disabled = true);
    this.removeBtn.forEach(btn => btn.disabled = true);
  }
}