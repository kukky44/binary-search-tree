const OPERATIONS_SNIPPET = {
  insertCallR: `public void insert(int value) {
  <span class="highlighted">root = insertIntoSubtree(root, value);</span>
}`,
  insert: {
    code: `private Node insertIntoSubtree(Node cRoot, int value) {
  if (cRoot == null) {
    return new Node(value);
  }

  if(value == cRoot.value) {
    return cRoot;
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
      [5],    // if(value == cRoot.value) {
      [9],   // highlight "if (value < cRoot.value)"
      [12],   // highlight "else if (value > cRoot.value)"
      [16],   // highlight "return cRoot;"
      []      // no highlight
    ],
    highlightTargets: {
      newNode: [2],    // highlight "return new Node(value);"
      leftInsert: [10],   // highlight "cRoot.left = insert(cRoot.left, value);"
      rightInsert: [13],   // highlight "cRoot.right = insert(cRoot.right, value);"
      returnCRoot: [6], // return cRoot; (duplicate)
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