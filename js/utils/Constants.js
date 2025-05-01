/**
 * Application-wide constants
 */

// Define the canvas width based on the window width
const windowWidth = window.innerWidth
let cw = 520;
if(windowWidth < 980){
  cw = 400;
}
if(windowWidth < 730) {
  cw = 300;
}

// Canvas dimensions
const CANVAS = {
  WIDTH: cw,
  HEIGHT: 360
};

// Node dimensions and positioning
const NODE = {
  WIDTH: 50,
  HEIGHT: 40,
  NEXT_SIZE: 40,
  SPACING: 80,
  DEFAULT_X: 15,
  DEFAULT_Y: 140
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

const OPERATIONS_SNIPPET = {
  insertCallR: `public void insert(int value) {
  <span class="highlighted">root = insertIntoSubtree(root, value);</span>
}`,
  insert: {
    code: `private Node insertIntoSubtree(Node cRoot, int value) {
  if (cRoot == null) {
    return new Node(value);
  }

  if (value < cRoot.value) {
    cRoot.left = insertIntoSubtree(cRoot.left, value);
  }
  else if (value > cRoot.value) {
    cRoot.right = insertIntoSubtree(cRoot.right, value);
  }

  return cRoot;
}`,
    highlightSequence: [
      [0],    // highlight "public void insert(int value) {"
      [1],    // highlight "if (cRoot == null)"
      [5],   // highlight "if (value < cRoot.value)"
      [8],   // highlight "else if (value > cRoot.value)"
      [12],   // highlight "return cRoot;"
      []      // no highlight
    ],
    highlightTargets: {
      newNode: [2],    // highlight "return new Node(value);"
      leftInsert: [6],   // highlight "cRoot.left = insert(cRoot.left, value);"
      rightInsert: [9],   // highlight "cRoot.right = insert(cRoot.right, value);"
    }
  },
  removeCallR: `public void remove(Appliance a){
  <span class="highlighted">root = removeR(root, a);</span>
}`,
  remove: {
    code: `private Node removeR(Node cRoot, int target) {
  if(cRoot == null) {
    return null;
  }

  if(target < cRoot.value) {
    cRoot.left = removeR(cRoot.left, target);
  } else if(target > cRoot.value) {
    cRoot.right = removeR(cRoot.right, target);
  } else {
    if(cRoot.left == null) {
      return cRoot.right;
    } else if(cRoot.right == null) {
      return cRoot.left;
    }

    Node successor = cRoot.right;
    Node successorParent = cRoot;

    while(successor.left != null) {
      successorParent = successor;
      successor = successor.left;
    }

    cRoot.value = successor.value;

    if(successorParent == cRoot) {
      cRoot.right = successor.right;
    } else {
      successorParent.left = successor.right;
    }
  }

  return cRoot;
}`,
    highlightSequence: [
      [0],
      [1], // if(cRoot == null) {
      [5], // if(target < cRoot.value) {
      [7], // } else if(target > cRoot.value) {
      [9], // } else {
      [10], // if(cRoot.left == null) {
      [12], // } else if(cRoot.right == null) {
      [16], // Node successor = cRoot.right;
      [17], // Node successorParent = cRoot;
      [19], // while(successor.left != null) {
      [20, 21], // successorParent = successor;, successor = successor.left;
      [24], // cRoot.value = successor.value;
      [26], // if(successorParent == cRoot) {
      ],
      highlightTargets: {
        whileLoop: [9],
        returnNull: [2],
        leftRemove: [6],
        rigthRemove: [8],
        returnCRoot: [33],
        returnRight: [11],
        returnLeft: [13],
        assignToCRoot: [27], // cRoot.right = successor.right;
        assignToParent: [29], // successorParent.left = successor.right;
    }
  }
}

// Step descriptions
const STEP_DESCRIPTIONS = {
  insert: [
    'Call the recursive method to insert a value into the tree',
    'Check if the curret root is null',
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
  returnInitial: 'Return it to the initial call',
  updatedCRoot: 'The current root is updated including the new node',
  insertFinish: 'Assign the root with modified tree',
  insertFinished: 'The new node is added to the tree',
  returnNull: 'If so, return null (not found in this subtree)',
  removeReturnR: 'Return the right subtree (swap with it)',
  removeReturnL: 'Return the left subtree (swap with it)',
  removeFinish: 'Assign the root with modified tree (not modified if not found)',
  removeFinished: 'The target node is removed from the tree or it was not found',
  assignToCRoot: 'If so, assign the right child of the sccessor to the right child of the current root',
  assignToParent: 'Else, assign the right child of the sccessor to the left child of the successor parent',
};
