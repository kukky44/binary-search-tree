/**
 * Base animation controller class containing shared functionality
 */
class BaseAnimationController {
  /**
   * Creates a new base animation controller
   * @param {IntBST} intBST - The binary search tree to animate
   * @param {CodeDisplayManager} codeDisplayManager - Manager for code snippets
   * @param {UIController} uiController - Controller for UI updates
   * @param {RecursionStackController} rsController
   */
  constructor(intBST, codeDisplayManager, uiController, rsController) {
    this.intBST = intBST;
    this.codeDisplayManager = codeDisplayManager;
    this.uiController = uiController;
    this.rsController = rsController;

    this.state = {
      operation: null, // 'insert' or 'remove'
      value: null,
      step: 1,
      maxSteps: 0,
      animating: false,
      animationSpeed: ANIMATION.SPEED,
      mode: 'step', // 'step' or 'animate'
    };

    this.animationCount = 0;
    this.currNode = null;
    this.currSuccessor = null;
    this.currSParent = null;
    this.currentRsStack = 0;
    this.subHighlighted = [];
    this.recursionStack = [];
    this.isRemoving = false;
    this.displayNew = false;
    this.flags = {
      pause: false,
    };
  }

  /**
   * Starts an add animation
   * @param {int} value - The value to add
   */
  startInsertAnimation(value) {
    this.resetAnimation();
    this.state.operation = 'insert';
    this.state.value = Number.parseInt(value);
    this.state.maxSteps = ANIMATION.STEPS.INSERT;

    this.displayNew = true;

    this.codeDisplayManager.addLayer();
    this.codeDisplayManager.setCode(OPERATIONS_SNIPPET.insertCallR);
    this.uiController.setStepDesc(STEP_DESCRIPTIONS.insert[0]);

    if (this.state.mode === 'animate') {
      this.state.animating = true;
      this.uiController.disableStepBtns();
    }
  }

  /**
   * Starts a remove animation
   * @param {int} value - The value to remove
   */
  startRemoveAnimation(value) {
    this.resetAnimation();
    this.state.operation = 'remove';
    this.state.value = value;
    this.state.maxSteps = ANIMATION.STEPS.REMOVE;
    this.uiController.displayVisDesc();

    this.codeDisplayManager.addLayer();
    this.codeDisplayManager.setCode(OPERATIONS_SNIPPET.removeCallR);
    this.uiController.setStepDesc(STEP_DESCRIPTIONS.remove[0]);

    this.currSuccessor = null;
    this.currSParent = null;

    if (this.state.mode === 'animate') {
      this.state.animating = true;
      this.uiController.disableStepBtns();
    }
  }

  /**
   * Resets animation state to initial values
   */
  resetAnimation() {
    this.currNode = this.intBST.root;

    this.state.step = 0;
    this.animationCount = 0;
    this.state.animating = false;

    this.uiController.showStepDesc();
    this.uiController.enableNextBtn();
    this.uiController.disableOperationsBtns();
    this.uiController.enableSkipBtn();
  }

  popStack() {
    this.recursionStack.pop();
    this.currNode = this.recursionStack[this.recursionStack.length-1]?.node;
    this.rsController.pop();
    this.codeDisplayManager.removeLayer(this.flags);
  }

  switchStack = (index) => {
    this.currentRsStack = index;
    this.rsController.switch(this.currentRsStack);
  }

  /**
   * Moves to the previous animation step
   */
  prevStep = () => {
    if (!this.state.operation) return;

    if (this.state.step <= 1) {
      this.uiController.hideStepDesc();
    } else {
      this.uiController.showStepDesc();
    }

    if (this.state.step === 2) {
      this.uiController.disablePrevBtn();
    }

    if (this.state.step > 0) {
      this.state.step = prevStep;
      this.updateCodeSnippet();

      if (this.state.operation === 'insert') {
        this.codeDisplayManager.setCode(CODE_SNIPPETS.add[this.state.step]);
      } else {
        this.currNode--;
        this.codeDisplayManager.setCode(CODE_SNIPPETS.remove[this.state.step]);
      }
    }
  }

  /**
   * Updates code snippet based on current state
   */
  updateCodeSnippet() {
    let description = STEP_DESCRIPTIONS[this.state.operation][this.state.step];
    this.uiController.setStepDesc(description);
    this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
  }

  assignNewNodepos() {
    let x = CANVAS.WIDTH / 2, y = NODE.DEFAULT_Y;
    const prevNode = this.recursionStack[this.recursionStack.length-2]?.node;

    if(!prevNode) {
      this.tempIntBst.root.x = x;
      this.tempIntBst.root.y = y;
      return;
    }

    if(prevNode.value > this.tempIntBst.root.value) {
      x = prevNode.x - 40;
    } else {
      x = prevNode.x + 40;
    }
    this.tempIntBst.root.x = x;
    this.tempIntBst.root.y = prevNode.y + 40;
  }

  /**
   * Finishes the current animation
   */
  finishAnimation() {
    this.recursionStack = [];
    this.uiController.hideStepDesc();
    this.uiController.disableStepBtns();
    this.uiController.enableOperationBtns();
    this.uiController.disableSKipBtn();
    this.uiController.clearInputs();
    this.uiController.hideVisDesc();
    this.rsController.clear();
    this.codeDisplayManager.clearCode();
    this.subHighlighted = [];
    this.state.operation = null;
  }

  /**
   * Updates animation on each frame
   */
  update() {
    if (this.state.animating && this.state.mode === 'animate') {
      this.animationCount++;
      if (this.animationCount % this.state.animationSpeed === 0) {
        this.nextStep();
      }
    }
  }

  /**
   * Sets the animation mode
   * @param {string} mode - Either 'step' or 'animate'
   */
  setMode(mode) {
    this.state.mode = mode;
    if (mode === 'animate' && this.state.operation) {
      this.state.animating = true;
    } else {
      this.state.animating = false;
    }
  }

  /**
   * Gets the current animation state
   * @returns {Object} The current animation state
   */
  getState() {
    return this.state;
  }
} 