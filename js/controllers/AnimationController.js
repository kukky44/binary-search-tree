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
    this.currSuccessor= null;
    this.currSParent= null;
    this.currentRsStack = 0;
    this.subHighlighted = [];
    this.recursionStack = [];
    this.isRemoving = false;
    this.addingIntBst = new IntBST();
    this.addingRoot = null;
    this.displayNew = false;
  }

  /**
   * Starts an add animation
   * @param {int} value - The value to add
   */
  startInsertAnimation(value) {
    this.resetAnimation();
    this.state.operation = 'insert';
    this.state.value = value;
    this.state.maxSteps = ANIMATION.STEPS.INSERT;

    this.addingIntBst.root = null;
    this.addingRoot = null;
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
    // if(this.state.operation === 'insert') {
    //   this.addingIntBst.root = popped.node;
    //   this.addingIntBst.insert(this.state.value);
    // }
    this.currNode = this.recursionStack[this.recursionStack.length-1]?.node;
    this.rsController.pop();
    this.codeDisplayManager.removeLayer();
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

    if(this.state.step === 20) {
      this.currSuccessor = null;
      this.currSParent = null;
      if(this.isRemoving) {
        this.intBST.remove(this.state.value);
        this.isRemoving = false;
      }
      if(this.recursionStack.length) {
        this.popStack();
        this.state.step = 27;
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.updatedCRoot);

        if(this.recursionStack.length && this.state.operation === 'insert') {
          this.addingIntBst.root = this.recursionStack[this.recursionStack.length-1].node;
          this.addingIntBst.insert(this.state.value);
        }

        if(!this.recursionStack.length) {
          if(this.state.operation === 'insert') {
            this.uiController.setStepDesc(STEP_DESCRIPTIONS.insertFinish);
          }
          if(this.state.operation === 'remove') {
            this.uiController.setStepDesc(STEP_DESCRIPTIONS.removeFinish);
          }
          this.state.step = 29;
        }
      }
      return;
    }

    if(this.state.operation == 'insert') {
      if(this.state.step  === 0) {
        const newItem = {
          node: this.currNode,
          targetVal: this.state.value,
          action: 2,
          step: this.state.step
        }

        this.recursionStack.push(newItem);
        this.rsController.insert(newItem, this.switchStack);
        this.codeDisplayManager.addLayer();
      }

      if(this.state.step !== 29 && this.currNode === null) {
        this.state.step = 20;
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.insertNewNode);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
        this.addingIntBst.insert(this.state.value);
        this.recursionStack[this.recursionStack.length-1].node = this.addingIntBst.root;
        this.assignNewNodepos();
        this.displayNew = false;
        return;
      }
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
        targetVal: this.state.value,
        action: action,
        step: this.state.step
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
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.callLeft);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
        return;
      }
    }

    if(this.state.step === 3) {
      if(this.state.value > this.currNode.value) {
        this.state.step = 16;
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.callRight);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
        return;
      }
    }

    if(this.state.operation === 'remove') {
      if(this.state.step === 0) {
        const targetItem = {
          node: this.currNode,
          targetVal: this.state.value,
          action: 2
        }

        this.recursionStack.push(targetItem);
        this.rsController.insert(targetItem, this.switchStack);
        this.codeDisplayManager.addLayer();
      }

      if(this.state.step === 1 && this.currNode === null) {
        this.state.step = 20;
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.returnNull);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, 60));
        return;
      }

      if(this.state.step === 5 && this.currNode.left === null) {
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.removeReturnR);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, 21));
        this.isRemoving = true;
        this.state.step = 20;
        return;
      }

      if(this.state.step === 6 && this.currNode.right === null) {
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.removeReturnL);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, 22));
        this.isRemoving = true;
        this.state.step = 20;
        return;
      }

      // For swapping nodes
      if(this.state.step === 6) {
        this.currSuccessor = this.currNode.right;
        this.currSParent = this.currNode;
      }

      if(this.state.step === 9) {
        if(this.currSuccessor.left === null) {
          this.state.step = 11;
          this.currNode.value = this.currSuccessor.value;
          this.uiController.setStepDesc(STEP_DESCRIPTIONS.remove[this.state.step]);
          this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
          return;
        } else {
          this.currSParent = this.currSuccessor;
          this.currSuccessor = this.currSuccessor.left;
        }
      }

      if(this.state.step === 10) {
        this.state.step = 9;
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.remove[this.state.step]);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
        return;
      }

      if(this.state.step === 12) {
        if(this.currSParent === this.currNode) {
          this.state.step = 27;
          this.uiController.setStepDesc(STEP_DESCRIPTIONS.assignToCRoot);
          this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, 23));
          this.currNode.right = this.currSuccessor.rigth;
        } else {
          this.state.step = 27;
          this.uiController.setStepDesc(STEP_DESCRIPTIONS.assignToParent);
          this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, 24));
          this.currSParent.left = this.currSuccessor.right;
        }
        return;
      }

      if(this.currNode === null) {
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.returnNull);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step))
      }
    }

    if (this.state.step < this.state.maxSteps) {
      this.uiController.showStepDesc();
      this.state.step++;

      if(this.state.operation === 'insert' && this.state.step === 30) {
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.insertFinished);
      } else  if(this.state.operation === 'remove' && this.state.step === 30) {
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.removeFinished);
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
        } else if (this.state.operation === 'remove') {
          // this.intBST.remove(this.state.value);
        }
      }
    }
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
    let x, y;
    const prevNode = this.recursionStack[this.recursionStack.length-2].node;
    if(prevNode.value > this.addingIntBst.root.value) {
      x = prevNode.x - 40;
    } else {
      x = prevNode.x + 40;
    }
    this.addingIntBst.root.x = x;
    this.addingIntBst.root.y = prevNode.y + 40;
  }

  getHighlightedCode(operation, step) {
    const { code, highlightSequence, highlightTargets } = OPERATIONS_SNIPPET[operation];
    const lines = code.split('\n');

    let linesToHighlight = highlightSequence[step] || [];

    if(operation === 'insert') {
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
    }

    if(operation === 'remove') {
      if(step === 60) {
        linesToHighlight = highlightTargets.returnNull;
      }

      if(step === 15) {
        linesToHighlight = highlightTargets.leftRemove;
        this.subHighlighted = highlightTargets.leftRemove;
      }

      if(step === 16) {
        linesToHighlight = highlightTargets.rigthRemove;
        this.subHighlighted = highlightTargets.rigthRemove;
      }

      if(step === 21) {
        linesToHighlight = highlightTargets.returnRight;
      }

      if(step === 22) {
        linesToHighlight = highlightTargets.returnLeft;
      }

      if(step === 23) {
        linesToHighlight = highlightTargets.assignToCRoot;
      }

      if(step === 24) {
        linesToHighlight = highlightTargets.assignToParent;
      }

      if(step === 26) {
        linesToHighlight = highlightTargets.returnCRoot;
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
    this.uiController.disableSKipBtn();
    this.uiController.clearInputs();
    this.uiController.hideVisDesc();
    this.rsController.clear();
    this.codeDisplayManager.clearCode();
    this.subHighlighted = [];
    this.state.operation = null;
    this.addingIntBst.root = null;
    this.addingRoot = null;
  }

  skipAnimation() {
    if(this.state.operation === 'insert') {
      this.intBST.insert(this.state.value);
    }
    if(this.state.operation === 'remove') {
      this.intBST.remove(this.state.value);
    }
    this.finishAnimation();
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