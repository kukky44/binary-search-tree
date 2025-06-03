/**
 * @fileoverview
 * This file contains the code snippets for the normal BST
 * some codes are hidden for partial-code version
 */

const OPERATIONS_SNIPPET = {
  insertCallR: `public void insert(int value) {
  <span class="highlighted">root = insertIntoSubtree(root, value);</span>
}`,
  insert: {
    code: `private Node insertIntoSubtree(Node cRoot, int value) {
  if (cRoot == null) {
    return new Node(value);
  }

  ████████████████████
    ██████████████████████████████████████
  █
  ████████████████
    ██████████████████████████████████████
  █

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
  removeCallR: `public void remove(int value){
  <span class="highlighted">root = removeR(root, value);</span>
}`,
  remove: {
    code: `private Node removeR(Node cRoot, int target) {
  if(cRoot == null) {
    return null;
  }

  if(target < cRoot.value) {
    ██████████████████████████████████████
  } else if(target > cRoot.value) {
    ██████████████████████████████████████
  } else {
    if(cRoot.left == null) {
      return cRoot.right;
    } else if(cRoot.right == null) {
      return cRoot.left;
    }

    ██████████████████████████████████████
    ██████████████████████████████████████

    while(successor.left != null) {
      ███████████████████████████████
      ███████████████████████████████
    }

    cRoot.value = successor.value;

    if(successorParent == cRoot) {
      ████████████████████████████
    } else {
      █████████████████████████████████
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