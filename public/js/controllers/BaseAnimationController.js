/**
 * Base animation controller class containing shared functionality for BST and AVL animations
 */
class BaseAnimationController {
  /**
   * Creates a new base animation controller
   * @constructor
   * @param {IntBST} intBST - The binary search tree to animate
   * @param {CodeDisplayManager} codeDisplayManager - Manager for code snippets
   * @param {UIController} uiController - Controller for UI updates
   * @param {RecursionStackController} rsController - Controller for recursion stack
   */
  constructor(intBST, codeDisplayManager, uiController, rsController) {
    this.intBST = intBST;
    this.codeDisplayManager = codeDisplayManager;
    this.uiController = uiController;
    this.rsController = rsController;

    this.state = {
      operation: null,
      value: null,
      step: 1,
      maxSteps: 0,
      animating: false,
      animationSpeed: ANIMATION.SPEED,
      mode: 'step',
    };

    this.animationCount = 0;
    this.stepCount = 0;
    this.initialTree = null;
    this.initialOperation = null;
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
      isPrev: false,
      isTemp: false,
    };
  }

  /**
   * Starts an insert animation
   * @param {int} value - The value to add
   */
  startInsertAnimation(value) {
    this.resetAnimation();
    this.state.operation = 'insert';
    this.initialOperation = 'insert';
    this.state.value = Number.parseInt(value);
    this.state.maxSteps = ANIMATION.STEPS.INSERT;

    this.displayNew = true;

    this.codeDisplayManager.addLayer(this.flags);
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
    this.initialOperation = 'remove';
    this.state.value = value;
    this.state.maxSteps = ANIMATION.STEPS.REMOVE;
    this.uiController.displayVisDesc();

    this.codeDisplayManager.addLayer(this.flags);
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
   * Resets animation state to initial values, updates UI
   */
  resetAnimation() {
    this.currNode = this.intBST.root;
    this.initialTree = this.deepCopyTree(this.intBST.root);

    this.state.step = 0;
    this.animationCount = 0;
    this.state.animating = false;
    this.stepCount = 0;

    this.uiController.showStepDesc();
    this.uiController.enableNextBtn();
    this.uiController.disableOperationsBtns();
    this.uiController.enableSkipBtn();
  }

  /**
   * Pops the recursion stack, updates the current node, and removes the current code layer
   */
  popStack() {
    this.recursionStack.pop();
    this.currNode = this.recursionStack[this.recursionStack.length-1]?.node;
    this.rsController.pop();
    this.codeDisplayManager.removeLayer(this.flags);
  }

  /**
   * Switches the recursion stack (for the recursion stack tab)
   * @method
   * @param {number} index - The index of the recursion stack to switch to
   */
  switchStack = (index) => {
    this.currentRsStack = index;
    this.rsController.switch(this.currentRsStack);
  }

  /**
   * Moves to the previous animation step.
   * The initial structure of the tree is stored when the operation starts, and after
   * this method is called, the tree is reset to the initial structure it calls nextStep()
   * untill it reaches the previous step.
   * @method
   */
  prevStep = () => {
    if (!this.state.operation) return;
    this.flags.isPrev = true;
    let count = this.stepCount;
    this.codeDisplayManager.clearCode();

    if (this.state.step <= 1) {
      this.uiController.hideStepDesc();
    } else {
      this.uiController.showStepDesc();
    }

    this.finishAnimation();
    this.intBST.root = this.initialTree;
    if(this.initialOperation === 'insert') {
      this.startInsertAnimation(this.state.value);      
    } else {
      this.startRemoveAnimation(this.state.value);
    }
    
    count--;
    for(let i = 0; i < count; i++) {
      this.nextStep();
    }
    this.flags.isPrev = false;
  
  }

  /**
   * Moves to the next animation step.
   * It will be inherited by the animation controllers for the normal BST and AVL Tree.
   * @return {boolean} True if it can move to the next step, false otherwise
   */
  nextStep() {
    if(!this.state.operation) return false;

    if(!this.flags.isPrev && this.flags.pause) return false;
    this.stepCount++;
    
    console.log('ani state:', this.state.step);

    if (this.state.step === this.state.maxSteps) {
      this.finishAnimation();
      if (this.state.mode === 'animate') {
        this.state.animating = false;
      }
      return true;
    } 
    return true;
  }

  /**
   * Updates code snippet based on current state
   */
  updateCodeSnippet() {
    let description = STEP_DESCRIPTIONS[this.state.operation][this.state.step];
    this.uiController.setStepDesc(description);
    this.codeDisplayManager.setCode(this.getHighlightedCode(this.state.operation, this.state.step));
  }

  /**
   * Assigns the new node position for the temp tree based on the previous node
   */
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
   * Finishes the current animation, resets the animation state, clear views, and updates the UI
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
   * Gets the current animation state
   * @return {Object} The current animation state
   */
  getState() {
    return this.state;
  }

  /**
   * Deep copies a BST
   * @param {Node} node - The root node of the tree to copy
   * @return {Node} The copied root node of the tree
   */
  deepCopyTree(node) {
    if (!node) return null;
    const newNode = new Node(node.value);
    newNode.x = node.x;
    newNode.y = node.y;
    newNode.left = this.deepCopyTree(node.left);
    newNode.right = this.deepCopyTree(node.right);
    return newNode;
  }
} 