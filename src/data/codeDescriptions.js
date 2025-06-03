export const codeDescriptions = [
  {
    id: 'insert',
    title: 'Insert button',
    description:
    `When it's clicked, it validates the input value. If the input value is not a number, it shows an error message and returns.
    If it's valid, it calles <a href="/binary-search-tree/jsdoc/BaseAnimationController.html#startInsertAnimation">startInsertAnimation</a> method to start the animation, initializing the animation state and the view.
    It displays the initial code snippet on the operation code panel.
    `
  },
  {
    id: 'remove',
    title: 'Remove button',
    description: 
    `When it's clicked, it validates the input value. If the input value is not a number, it shows an error message and returns.
    If it's valid, it calles <a href="/binary-search-tree/jsdoc/BaseAnimationController.html#startRemoveAnimation">startRemoveAnimation</a> method to start the animation, initializing the animation state and the view.
    It displays the initial code snippet on the operation code panel.`
  },
  {
    id: 'prev',
    title: 'Previous button',
    description: 
    `It calles <a href="/binary-search-tree/jsdoc/BaseAnimationController.html#prevStep">prevStep</a> method to move to the previous step.
    The method initializes the tree to the initial structure before the animation and iterate <a href="/binary-search-tree/jsdoc/BaseAnimationController.html#nextStep">nextStep</a> method until it reaches the previous step.`
  },
  {
    id: 'next',
    title: 'Next button',
    description: 
    `It calles <a href="/binary-search-tree/jsdoc/BaseAnimationController.html#nextStep">nextStep</a> method to move to the next step.
    nextStep method has different implementations for each type of tree (<a href="/binary-search-tree/jsdoc/AnimationController.html#nextStep">Normal BST</a> or <a href="/binary-search-tree/jsdoc/AvlAnimationController.html#nextStep">AVL</a>).
    because the AVL tree has more operations to do in each step.
    The nextStep method updates the view (description and code snippet) and the BST structure based on the current animation status.
    The animation status is managed by operation strings (such as "insert" and "remove") and numbers (such as 1, 2, 3, 15, 20, etc.).
    When the BST structure is updated, the visualization is updated automatically as the <a href="/binary-search-tree/jsdoc/IntBSTRenderer.html">IntBSTRenderer</a> is listening to the BST structure.`
  },
  {
    id: 'skip',
    title: 'Skip button',
    description: 
    `It calles skipAnimation method (<a href="/binary-search-tree/jsdoc/AnimationController.html#skipAnimation">Normal BST</a> or <a href="/binary-search-tree/jsdoc/AvlAnimationController.html#skipAnimation">AVL</a>) to skip the animation and finish the operation.`
  },
  {
    id: 'operation-code',
    title: 'Operation code',
    description: 
    `It displays the code snippet of the current operation, highlighting the line that is currently being executed.
    The code snippet is updated based on the current animation status.
    When the nextStep method is called, the code snippet is generated using CodeSnippetFiles (<a href="/binary-search-tree/jsdoc/utils_CodeSnippet.js.html">Normal BST</a> or <a href="/binary-search-tree/jsdoc/utils_AvlCodeSnippet.js.html">AVL</a>).
    The highlighted line is created by calling getHighlightedCode method in each animation controller (<a href="/binary-search-tree/jsdoc/AnimationController.html#getHighlightedCode">Normal BST</a> or <a href="/binary-search-tree/jsdoc/AvlAnimationController.html#getHighlightedCode">AVL</a>).
    Then, the generated code snipped is displayed using <a href="/binary-search-tree/jsdoc/CodeDisplayManager.html">CodeDisplayManager</a>.`
  },
  {
    id: 'step-desc',
    title: 'Step description',
    description:
    `It displays the description of the current step.
    The description is updated based on the current animation status.
    The descriptions are stored in constants files (<a href="/binary-search-tree/jsdoc/utils_Constants.js.html">Normal BST</a> or <a href="/binary-search-tree/jsdoc/utils_AvlConstants.js.html">AVL</a>).
    In each step, a new description is set by calling <a href="/binary-search-tree/jsdoc/UIController.html#setStepDesc">setStepDesc</a> method.`
  }
];