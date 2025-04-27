/**
 * Application-wide constants
 */

// Define the canvas width based on the window width
const windowWidth = window.innerWidth
let cw = 500;
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
  insertCassR: `public void insert(int value) {
  <span class="highlighted">root = insertIntoSubtree(root, value);</span>
}
`,
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
    'Starting state',
    'Check if the list is empty',
    'Check if the head node contains the target value',
    'Initialize previous pointer to head and current pointer to head.next',
    'Loop through the list',
    'Check if the current node contains the target value',
    'Node containing target value is removed from the list',
  ],
  insertNewNode: 'If so, create a new node and return it',
  insertLeft: 'Call the recursive method passing the left child',
  insertRight: 'Call the recursive method passing the right child',
  returnCRoot: 'Return it to the previous method call',
  returnInitial: 'Return it to the initial call',
  updatedCRoot: 'The current root is updated including the new node',
  insertFinish: 'Assign the root with modifled tree',
  removeFromHead: 'If the head contains the target value, make “head” point to the next node',
  removed: 'The node is removed from the list',
  found: 'If the current node contains the target value, make previous next node to the curernt next node',
  notCurrent: 'If not, move the prev and current pointers',
  notFound: 'The target value is not in the list',
  onlyOne: 'The list includes only one node',
  insertFinished: 'The new node is added to the tree'
};

// Code snippets for animation steps
const CODE_SNIPPETS = {
  add: [
    'public void add(int value) {\n    Node newNode = new Node(value);\n    newNode.next = head;\n    head = newNode;\n}',
    'public void add(int value) {\n    <span class="highlighted">Node newNode = new Node(value);</span>\n    newNode.next = head;\n    head = newNode;\n}',
    'public void add(int value) {\n    Node newNode = new Node(value);\n    <span class="highlighted">newNode.next = head;</span>\n    head = newNode;\n}',
    'public void add(int value) {\n    Node newNode = new Node(value);\n    newNode.next = head;\n    <span class="highlighted">head = newNode;</span>\n}',
    '',
  ],
  remove: [
    'public void remove(int value) {\n    if(head == null) return;\n    \n    if(head.data == value) {\n        head = head.next;\n        return;\n    }\n    \n    Node prev = head;\n    Node current = head.next;\n    while(current != null) {\n        if(current.data == value) {\n            prev.next = current.next;\n            return;\n        }\n        prev = current;\n        current = current.next;\n    }\n}',
    'public void remove(int value) {\n    <span class="highlighted">if(head == null) return</span>;\n    \n    if(head.data == value) {\n        head = head.next;\n        return;\n    }\n    \n    Node prev = head;\n    Node current = head.next;\n    while(current != null) {\n        if(current.data == value) {\n            prev.next = current.next;\n            return;\n        }\n        prev = current;\n        current = current.next;\n    }\n}',
    'public void remove(int value) {\n    if(head == null) return;\n    \n    <span class="highlighted">if(head.data == value) {</span>\n        head = head.next;\n        return;\n    }\n    \n    Node prev = head;\n    Node current = head.next;\n    while(current != null) {\n        if(current.data == value) {\n            prev.next = current.next;\n            return;\n        }\n        prev = current;\n        current = current.next;\n    }\n}',
    'public void remove(int value) {\n    if(head == null) return;\n    \n    if(head.data == value) {\n        head = head.next;\n        return;\n    }\n    \n    <span class="highlighted">Node prev = head;</span>\n    <span class="highlighted">Node current = head.next;</span>\n    while(current != null) {\n        if(current.data == value) {\n            prev.next = current.next;\n            return;\n        }\n        prev = current;\n        current = current.next;\n    }\n}',
    'public void remove(int value) {\n    if(head == null) return;\n    \n    if(head.data == value) {\n        head = head.next;\n        return;\n    }\n    \n    Node prev = head;\n    Node current = head.next;\n    <span class="highlighted">while(current != null)</span> {\n        if(current.data == value) {\n            prev.next = current.next;\n            return;\n        }\n        prev = current;\n        current = current.next;\n    }\n}',
    'public void remove(int value) {\n    if(head == null) return;\n    \n    if(head.data == value) {\n        head = head.next;\n        return;\n    }\n    \n    Node prev = head;\n    Node current = head.next;\n    while(current != null) {\n        <span class="highlighted">if(current.data == value) {</span>\n            prev.next = current.next;\n            return;\n        }\n        prev = current;\n        current = current.next;\n    }\n}',
    'public void remove(int value) {\n    if(head == null) return;\n    \n    if(head.data == value) {\n        head = head.next;\n        return;\n    }\n    \n    Node prev = head;\n    Node current = head.next;\n    while(current != null) {\n        if(current.data == value) {\n            prev.next = current.next;\n            return;\n        }\n        prev = current;\n        current = current.next;\n    }\n}',
    '',
  ],
  removeFromHead: 'public void remove(int value) {\n    if(head == null) return;\n    \n    if(head.data == value) {\n        <span class="highlighted">head = head.next;</span>\n        return;\n    }\n    \n    Node prev = head;\n    Node current = head.next;\n    while(current != null) {\n        if(current.data == value) {\n            prev.next = current.next;\n            return;\n        }\n        prev = current;\n        current = current.next;\n    }\n}',
  movePointers: 'public void remove(int value) {\n    if(head == null) return;\n    \n    if(head.data == value) {\n        head = head.next;\n        return;\n    }\n    \n    Node prev = head;\n    Node current = head.next;\n    while(current != null) {\n        if(current.data == value) {\n            prev.next = current.next;\n            return;\n        }\n        <span class="highlighted">prev = current;</span>\n        <span class="highlighted">current = current.next;</span>\n    }\n}',
  removeTarget: 'public void remove(int value) {\n    if(head == null) return;\n    \n    if(head.data == value) {\n        head = head.next;\n        return;\n    }\n    \n    Node prev = head;\n    Node current = head.next;\n    while(current != null) {\n        if(current.data == value) {\n            <span class="highlighted">prev.next = current.next;</span>\n            return;\n        }\n        prev = current;\n        current = current.next;\n    }\n}',
};