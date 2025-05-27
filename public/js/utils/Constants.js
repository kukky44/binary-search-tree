/**
 * Application-wide constants
 */

// Node dimensions and positioning
const NODE = {
  WIDTH: 50,
  HEIGHT: 40,
  NEXT_SIZE: 40,
  SPACING: 80,
  DEFAULT_X: 15,
  DEFAULT_Y: 60
};

// New node animation positioning
 const NEW_NODE = {
  X: 80,
  Y: 40
};

// Colors
 const COLORS = {
  NODE_FILL: [230, 230, 230],
  NODE_STROKE: [160, 160, 160],
  NODE_NULL: [250, 250, 250],
  FOCUS: [255, 0, 0],
  CURRENT: [88, 237, 167],
  SPARENT: [14, 27, 206],
  NEXT_FILL: [240, 240, 240],
  HEAD_FILL: [200, 200, 200],
  HEAD_STROKE: [0, 0, 0],
  CONNECT_STROKE: [60, 60, 60],
  TEXT: [0, 0, 0]
};

// Animation settings
 const ANIMATION = {
  SPEED: 100,
  STEPS: {
    INSERT: 30,
    REMOVE: 30
  }
};

// Step descriptions
const STEP_DESCRIPTIONS = {
  insert: [
    'Call the recursive method to insert a value into the tree',
    'Check if the current root is null',
    'Check if the target value matches the value of the current root (no duplicates allowed)',
    'Check if the target value is less than the value of the current root',
    'Check if the target value is greater than the value of the current root',
  ],
  remove: [
    'Call the recursive method to remove a node with the target value',
    'Check if the current root is empty',
    'Check if the target value is less than the value of the current root',
    'Check if the target value is greater than the value of the current root',
    'Else, the target value matches the value of the current node',
    'Check if the left child is empty',
    'Check if the right child is empty',
    'Assign the right child as the successor (to find the leftmost subtree)',
    'Assign the current root as the successor parent',
    'Loop through until it reaches the leftmost subtree',
    'Assign new successor and its new parent',
    'Swap the value of the successor with the value of the current root',
    'Check if the successor parent is the current root',
  ],
  insertNewNode: 'If so, create a new node and return it',
  callLeft: 'Call the recursive method passing the left child',
  callRight: 'Call the recursive method passing the right child',
  returnCRoot: 'Return it to the previous method call',
  noDupulicates: 'Return it to the previous method call to avoid dupulicates',
  returnInitial: 'Return it to the initial call',
  updatedCRoot: 'The current root is updated including the new node (if created)',
  insertFinish: 'Assign the root to the tree',
  insertFinished: 'The insert operation is finished',
  returnNull: 'If so, return null (not found in this subtree)',
  removeReturnR: 'Return the right subtree (swap with it)',
  removeReturnL: 'Return the left subtree (swap with it)',
  removeFinish: 'Assign the root with modified tree (not modified if not found)',
  removeFinished: 'The target node is removed from the tree or it was not found',
  assignToCRoot: 'If so, assign the right child of the sccessor to the right child of the current root',
  assignToParent: 'Else, assign the right child of the sccessor to the left child of the successor parent',
};
