/**
 * Controls animation state and transitions for Binary Search Tree
 */
class AnimationController extends BaseAnimationController {
  /**
   * Creates a new animation controller for BST
   * @param {IntBST} intBST - The binary search tree to animate
   * @param {CodeDisplayManager} codeDisplayManager - Manager for code snippets
   * @param {UIController} uiController - Controller for UI updates
   * @param {RecursionStackController} rsController
   */
  constructor(intBST, codeDisplayManager, uiController, rsController) {
    super(intBST, codeDisplayManager, uiController, rsController);
    this.tempIntBst = new IntBST();
  }

  /**
   * Starts an add animation
   * @param {int} value - The value to add
   */
  startInsertAnimation(value) {
    super.startInsertAnimation(value);
    this.tempIntBst.root = null;
  }

  nextStep = () => {
    if(!super.nextStep()) return;

    if(this.state.step === 20) {
      this.handleStep20();
      return;
    }

    if(this.state.operation === 'insert') {
      if(this.handleInsertOperation()) return;
    }

    if(this.state.step === 27) {
      this.handleStep27();
      return;
    }

    if(this.state.step === 15 || this.state.step === 16) {
      this.handleSteps15And16();
      return;
    }

    if(this.state.operation === 'remove') {
      if(this.handleRemoveOperation()) return;
    }

    this.handleRegularStep();
  }

  handleStep20() {
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
        this.tempIntBst.root = this.recursionStack[this.recursionStack.length-1].node;
        this.tempIntBst.insert(this.state.value);
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
  }

  handleStep27() {
    this.uiController.setStepDesc(STEP_DESCRIPTIONS.returnCRoot);
    this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, 26));
    this.state.step = 20;
    if(this.recursionStack.length === 1) {
      this.uiController.setStepDesc(STEP_DESCRIPTIONS.returnInitial);
    }
  }

  handleSteps15And16() {
    const action = this.state.step === 15 ? 0 : 1;
    this.currNode = this.state.step === 15 ? this.currNode.left : this.currNode.right;

    const newItem = {
      node: this.currNode,
      targetVal: this.state.value,
      action,
      step: this.state.step
    };

    this.recursionStack.push(newItem);
    this.rsController.insert(newItem, this.switchStack);
    this.codeDisplayManager.addLayer(this.flags);

    this.state.step = 1;
    this.updateCodeSnippet();
  }

  handleInsertOperation() {
    if(this.state.step === 0) {
      const newItem = {
        node: this.currNode,
        targetVal: this.state.value,
        action: 2,
        step: this.state.step
      };

      this.recursionStack.push(newItem);
      this.rsController.insert(newItem, this.switchStack);
      this.codeDisplayManager.addLayer(this.flags);
      return false;
    }

    if(this.state.step === 2 && this.state.value == this.currNode.value) {
      this.state.step = 20;
      this.uiController.setStepDesc(STEP_DESCRIPTIONS.noDupulicates);
      this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, 8));
      return true;
    }

    if(this.state.step === 3 && this.state.value < this.currNode.value) {
      this.state.step = 15;
      this.uiController.setStepDesc(STEP_DESCRIPTIONS.callLeft);
      this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
      return true;
    }

    if(this.state.step === 4 && this.state.value > this.currNode.value) {
      this.state.step = 16;
      this.uiController.setStepDesc(STEP_DESCRIPTIONS.callRight);
      this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
      return true;
    }

    if(this.state.step > 0 && this.currNode === null) {
      this.state.step = 20;
      this.uiController.setStepDesc(STEP_DESCRIPTIONS.insertNewNode);
      this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
      this.tempIntBst.insert(this.state.value);
      this.recursionStack[this.recursionStack.length-1].node = this.tempIntBst.root;
      this.assignNewNodepos();
      this.displayNew = false;
      return true;
    }

    return false;
  }

  handleRemoveOperation() {
    if(this.state.step === 0) {
      const targetItem = {
        node: this.currNode,
        targetVal: this.state.value,
        action: 2
      };

      this.recursionStack.push(targetItem);
      this.rsController.insert(targetItem, this.switchStack);
      this.codeDisplayManager.addLayer(this.flags);
      return false;
    }

    if(this.state.step === 1 && this.currNode === null) {
      this.state.step = 20;
      this.uiController.setStepDesc(STEP_DESCRIPTIONS.returnNull);
      this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, 60));
      return true;
    }

    if(this.state.step === 2 && this.state.value < this.currNode.value) {
      this.state.step = 15;
      this.uiController.setStepDesc(STEP_DESCRIPTIONS.callLeft);
      this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
      return true;
    }

    if(this.state.step === 3 && this.state.value > this.currNode.value) {
      this.state.step = 16;
      this.uiController.setStepDesc(STEP_DESCRIPTIONS.callRight);
      this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
      return true;
    }

    if(this.state.step === 5 && this.currNode.left === null) {
      this.uiController.setStepDesc(STEP_DESCRIPTIONS.removeReturnR);
      this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, 21));
      this.isRemoving = true;
      this.state.step = 20;
      return true;
    }

    if(this.state.step === 6) {
      if(this.currNode.right === null) {
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.removeReturnL);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, 22));
        this.isRemoving = true;
        this.state.step = 20;
        return true;
      }
      this.currSuccessor = this.currNode.right;
      this.currSParent = this.currNode;
      return false;
    }

    if(this.state.step === 9) {
      if(this.currSuccessor.left === null) {
        this.state.step = 11;
        this.currNode.value = this.currSuccessor.value;
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.remove[this.state.step]);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
        return true;
      }
      this.currSParent = this.currSuccessor;
      this.currSuccessor = this.currSuccessor.left;
      return false;
    }

    if(this.state.step === 10) {
      this.state.step = 9;
      this.uiController.setStepDesc(STEP_DESCRIPTIONS.remove[this.state.step]);
      this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
      return true;
    }

    if(this.state.step === 12) {
      this.state.step = 27;
      if(this.currSParent === this.currNode) {
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.assignToCRoot);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, 23));
        this.currNode.right = this.currSuccessor?.right ?? null;
      } else {
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.assignToParent);
        this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, 24));
        this.currSParent.left = this.currSuccessor.right;
      }
      return true;
    }

    if(this.currNode === null) {
      this.uiController.setStepDesc(STEP_DESCRIPTIONS.returnNull);
      this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
      return true;
    }

    return false;
  }

  handleRegularStep() {
    if (this.state.step < this.state.maxSteps) {
      this.uiController.showStepDesc();
      this.state.step++;

      if(this.state.operation === 'insert' && this.state.step === 30) {
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.insertFinished);
      } else if(this.state.operation === 'remove' && this.state.step === 30) {
        this.uiController.setStepDesc(STEP_DESCRIPTIONS.removeFinished);
      } else {
        this.updateCodeSnippet();
      }

      if (this.state.animating) {
        this.uiController.disableStepBtns();
      } else {
        this.uiController.enableStepBtns();
      }

      if (this.state.step === this.state.maxSteps) {
        if (this.state.operation === 'insert') {
          this.intBST.insert(this.state.value);
        }
      }
    }
  }

  getHighlightedCode(operation, step) {
    const { code, highlightSequence, highlightTargets } = OPERATIONS_SNIPPET[operation];
    const lines = code.split('\n');

    let linesToHighlight = highlightSequence[step] || [];

    if(operation === 'insert') {
      if(step === 8) {
        linesToHighlight = highlightTargets.returnCRoot;
      }

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
        linesToHighlight = highlightSequence[5];
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
      return line;
    }).join('\n');
  }

  finishAnimation() {
    super.finishAnimation();
    this.tempIntBst.root = null;
  }

  skipAnimation() {
    if(this.state.operation === 'insert') {
      this.intBST.insert(this.state.value);
    }
    if(this.state.operation === 'remove') {
      this.intBST.remove(this.state.value);
      if((this.state.step === 11 || this.state.step === 12) && this.currSuccessor) {
        this.intBST.remove(this.currSuccessor.value);
      }
    }
    this.finishAnimation();
  }
}