const OPERATIONS_SNIPPET = {
  insertCallR: `public void insert(int value) {
  <span class="highlighted">root = insertIntoSubtree(root, value);</span>
}`,
  insert: {
    code: `private Node insertIntoSubtree(Node cRoot, int value) {
  if (cRoot == null) {
    return new Node(value);
  }

  if (value == cRoot.value) {
    return cRoot;
  }

  if (value < cRoot.value) {
    cRoot.left = insertIntoSubtree(cRoot.left, value);
  }
  else if (value > cRoot.value) {
    cRoot.right = insertIntoSubtree(cRoot.right, value);
  }

  return balanceTree(cRoot, value);
}`,
    highlightSequence: [
      [0],    // highlight "public void insert(int value) {"
      [1],    // highlight "if (cRoot == null)"
      [5],    // if(value == cRoot.value) {
      [9],   // highlight "if (value < cRoot.value)"
      [12],   // highlight "else if (value > cRoot.value)"
      []      // no highlight
    ],
    highlightTargets: {
      newNode: [2],    // highlight "return new Node(value);"
      leftInsert: [10],   // highlight "cRoot.left = insert(cRoot.left, value);"
      rightInsert: [13],   // highlight "cRoot.right = insert(cRoot.right, value);"
      returnDupulicate: [6], // return cRoot; (duplicate)
      returnCRoot: [16],   // return balanceTree(cRoot, value);
    }
  },
  balance: {
    code: `public Node balanceTree(Node cRoot, int value){
  int balanceFactor = getBalanceFactor(cRoot);
  if (balanceFactor > 1) {
    if (value < cRoot.left.value) {
      return rotateRight(cRoot);
    } else if (value > cRoot.left.value) {
      return rotateLeftRight(cRoot);
    }
  }else if (balanceFactor < -1) {
    if (value < cRoot.right.value) {
      return rotateRightLeft(cRoot);
    } else if (value > cRoot.right.value) {
      return rotateLeft(cRoot);
    }
  }

  return cRoot;
}`,
    highlightSequence: [
      [1],   // int balanceFactor = getBalanceFactor(cRoot);
      [2],   // if(balanceFactor > 1) {
      [3],   // if(value < cRoot.left.value) {
      [5],   // }else if(value > cRoot.left.value) {
      [8],   // }else if (balanceFactor < -1) {
      [9],   // if(value < cRoot.right.value) {
      [11],   // }else if(value > cRoot.right.value) {
      []      // no highlight
    ],
    highlightTargets: {
      rotateRight: [4], // return rotateRight(cRoot);
      rotateLeftRight: [6], // return rotateLeftRight(cRoot);
      rotateRightLeft: [10], // return rotateRightLeft(cRoot);
      rotateLeft: [12], // return rotateLeft(cRoot);
      returnCRoot: [16], // return cRoot;
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

  return balanceTreeAfterRemoval(cRoot);
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
        returnCRoot: [33], // return balanceTreeAfterRemoval(cRoot);
        returnRight: [11],
        returnLeft: [13],
        assignToCRoot: [27], // cRoot.right = successor.right;
        assignToParent: [29], // successorParent.left = successor.right;
    }
  },
  balanceRm: {
    code: `private Node balanceTreeAfterRemoval(Node cRoot) {
  int balanceFactor = getBalanceFactor(cRoot);

  if (balanceFactor > 1) {
    int leftBalance = getBalanceFactor(cRoot.left);

    if (leftBalance >= 0) {
      return rotateRight(cRoot);
    } else {
      return rotateLeftRight(cRoot);
    }
  } else if (balanceFactor < -1) {
    int rightBalance = getBalanceFactor(cRoot.right);

    if (rightBalance <= 0) {
      return rotateLeft(cRoot);
    } else {
      return rotateRightLeft(cRoot);
    }
  }

  return cRoot;
}`,
    highlightSequence: [
      [1],   // int balanceFactor = getBalanceFactor(cRoot);
      [3],   // if(balanceFactor > 1) {
      [4],   // int leftBalance = getBalanceFactor(cRoot.left);
      [6],   // if (leftBalance >= 0) {
      [8],   // } else {
      [11],   //} else if (balanceFactor < -1) {
      [12],   // int rightBalance = getBalanceFactor(cRoot.right);
      [14],   // if (rightBalance <= 0) {
      [16],   // } else {
      [21],   // } else {
      []      // no highlight
    ],
    highlightTargets: {
      rotateRight: [7], // return rotateRight(cRoot);
      rotateLeftRight: [9], // return rotateLeftRight(cRoot);
      rotateLeft: [15], // return rotateLeft(cRoot);
      rotateRightLeft: [17], // return rotateRightLeft(cRoot);
      returnCRoot: [21], // return cRoot;
    }
  }
}