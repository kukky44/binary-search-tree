/**
 * Controls animation state and transitions
 */
class AnimationController {
  /**
   * Creates a new animation controller
   * @param {IntBST} intBST - The linked list to animate
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
    this.currentRsStack = 0;
    this.subHighlighted = [];
    this.recursionStack = [];
  }

  /**
   * Starts an add animation
   * @param {int} value - The value to add
   */
  startInsertAnimation(value) {
    this.resetAnimation();
    this.state.operation = 'insert';
    this.currNode = this.intBST.root;
    this.state.value = value;
    this.state.maxSteps = ANIMATION.STEPS.INSERT;

    this.codeDisplayManager.addLayer();
    this.codeDisplayManager.setCode(OPERATIONS_SNIPPET.insertCassR);
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

    this.codeDisplayManager.setCode(CODE_SNIPPETS.remove[1]);
    this.uiController.setStepDesc(STEP_DESCRIPTIONS.remove[1]);

    if (this.state.mode === 'animate') {
      this.state.animating = true;
      this.uiController.disableStepBtns();
    }
  }

  /**
   * Resets animation state to initial values
   */
  resetAnimation() {
    this.state.step = 0;
    this.animationCount = 0;
    this.state.animating = false;

    this.uiController.showStepDesc();
    this.uiController.enableNextBtn();
    this.uiController.disableOperationsBtns();
  }

  /**
   * Moves to the next animation step
   */
  nextStep = () => {
    if (!this.state.operation) return;
    console.log('ani state:', this.state.step);

    if (this.state.step === this.state.maxSteps) {
      this.finishAnimation();
      if (this.state.mode === 'animate') {
        this.state.animating = false;
      }
      return;
    }

    if(this.state.operation == 'insert') {
      if(this.state.step  === 0) {
        const newItem = {
          node: this.currNode,
          insertVal: this.state.value,
          action: 2
        }

        this.recursionStack.push(newItem);
        this.rsController.insert(newItem, this.switchStack);
        this.codeDisplayManager.addLayer();
      }

      if(this.state.step === 20) {
        if(this.recursionStack.length) {
          this.recursionStack.pop();
          this.currNode = this.recursionStack[this.recursionStack.length-1]?.node;
          this.rsController.pop();
          this.codeDisplayManager.removeLayer();
          this.state.step = 27;
          this.uiController.setStepDesc(STEP_DESCRIPTIONS.updatedCRoot);

          if(!this.recursionStack.length) {
            this.uiController.setStepDesc(STEP_DESCRIPTIONS.insertFinish);
            this.state.step = 29;
          }
        }
        return;
      }

      if(this.state.step === 27) {
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.returnCRoot);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, 26));
        this.state.step = 20;
        if(this.recursionStack.length === 1) {
          this.uiController.setStepDesc(STEP_DESCRIPTIONS.returnInitial);
        }
        return;
      }

      if(this.state.step !== 29 && this.currNode === null) {
        this.state.step = 20;
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.insertNewNode);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
        return;
      }
    }


    // if(this.state.value == this.currNode.value) {
    //   console.log('already exists');
    // }

    if(this.state.step === 15 || this.state.step === 16) {
      let action;

      if(this.state.step === 15) {
        this.currNode = this.currNode.left;
        action = 0;
      }

      if(this.state.step === 16) {
        this.currNode = this.currNode.right;
        action = 1;
      }

      const newItem = {
        node: this.currNode,
        insertVal: this.state.value,
        action: action
      }

      this.recursionStack.push(newItem);
      this.rsController.insert(newItem, this.switchStack);
      this.codeDisplayManager.addLayer();

      this.state.step = 1;
      this.updateCodeSnippet();
      return;
    }

    if(this.state.step === 2) {
      if(this.state.value < this.currNode.value) {
        this.state.step = 15;
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.insertLeft);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
        return;
      }
    }

    if(this.state.step === 3) {
      if(this.state.value > this.currNode.value) {
        this.state.step = 16;
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.insertRight);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
        return;
      }
    }

    if (this.state.step < this.state.maxSteps) {
      this.uiController.showStepDesc();
      this.state.step++;

      if(this.state.operation === 'insert' && this.state.step === 30) {
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.insertFinished);
      } else {
        this.updateCodeSnippet();
      }

      if (this.state.animating) {
        this.uiController.disableStepBtns();
      } else {
        this.uiController.enableStepBtns();
      }

      // Apply the operation at the final step
      if (this.state.step === this.state.maxSteps) {
        if (this.state.operation === 'insert') {
          this.intBST.insert(this.state.value);
        } else {
          // this.intBST.removeNode(this.state.value);
        }
      }
    }
  }

  switchStack = (index) => {
   this.currentRsStack = index;
   console.log(index);

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
        // if (this.state.step === 2) this.intBST.removeHead();
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

  getHighlightedCode(operation, step) {
    const { code, highlightSequence, highlightTargets } = OPERATIONS_SNIPPET[operation];
    const lines = code.split('\n');

    let linesToHighlight = highlightSequence[step] || [];

    if(step === 15) {
      linesToHighlight = highlightTargets.leftInsert;
      this.subHighlighted = highlightTargets.leftInsert;
    }

    if(step === 16) {
      linesToHighlight = highlightTargets.rightInsert;
      this.subHighlighted = highlightTargets.rightInsert;
    }

    if(step === 20) {
      linesToHighlight = highlightTargets.newNode;
    }

    if(step === 26) {
      linesToHighlight = highlightSequence[4];
    }

    if(step === 27) {
      if(this.recursionStack[this.recursionStack.length-1].action === 0) {
        linesToHighlight = highlightTargets.leftInsert;
      } else {
        linesToHighlight = highlightTargets.rightInsert;
      }
    }

    return lines.map((line, index) => {
      if (linesToHighlight.includes(index)) {
        return `<span class="highlighted">${line}</span>`;
      }
      if(this.subHighlighted[0] === index) {
        // return `<span class="sub-highlighted">${line}</span>`;
      }
      return line;
    }).join('\n');
  }

  /**
   * Finishes the current animation
   */
  finishAnimation() {
    this.recursionStack = [];
    this.uiController.hideStepDesc();
    this.uiController.disableStepBtns();
    this.uiController.enableOperationBtns();
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