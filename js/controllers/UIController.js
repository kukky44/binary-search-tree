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
    this.uiInputs = document.querySelectorAll('.ui-input');
    this.skipBtn = document.getElementById('skit-btn');
    this.visDesc = document.getElementById('visualization-desc');
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

  enableSkipBtn() {
    this.skipBtn.disabled = false;
  }

  disableSKipBtn() {
    this.skipBtn.disabled = true;
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

  clearInputs() {
    this.uiInputs.forEach(el => {
      el.value = '';
    })
  }

  displayVisDesc() {
    this.visDesc.classList.remove('hide');
  }

  hideVisDesc() {
    this.visDesc.classList.add('hide');
  }
}