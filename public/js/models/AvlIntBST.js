/**
 * Implements a AVL Tree
 */
class IntBST {
  /**
   * Creates a new AVL Tree
   * @constructor
   */
  constructor() {
    this.root = null;
  }

  /**
   * Inserts a new node with the given value to the AVL Tree
   * @param {*} value - The value to insert
   */
  insert(value) {
    this.root = this.insertIntoSubtree(this.root, value);
  }

  /**
   * Recursive function to insert a new node to the AVL Tree
   * @param {Node} cRoot The current root node
   * @param {int} value The value to insert
   * @return The root node after inserting a new node
   */
  insertIntoSubtree(cRoot, value) {
    if(cRoot === null) {
      return new Node(value);
    } else if (value == cRoot.value) {
      return cRoot;
    } else if (value < cRoot.value) {
      cRoot.left = this.insertIntoSubtree(cRoot.left, value);
    } else if (value > cRoot.value) {
      cRoot.right = this.insertIntoSubtree(cRoot.right, value);
    }

    const balanceFactor = this.getBalanceFactor(cRoot);
    if(balanceFactor > 1) {
      if(value < cRoot.left.value) {
        return this.rotateRight(cRoot);
      }else if(value > cRoot.left.value) {
        return this.rotateLeftRight(cRoot);
      }

    }else if (balanceFactor < -1) {
      if(value < cRoot.right.value) {
        return this.rotateRightLeft(cRoot);
      }else if(value > cRoot.right.value) {
        return this.rotateLeft(cRoot);
      }
    }

    return cRoot;
  }

  /**
   * Gets the balance factor of the given node
   * by subtracting the height of the left subtree from the height of the right subtree
   * @param {Node} cRoot The current root node
   * @return The balance factor of the given node
   */
  getBalanceFactor(cRoot) {
    if(cRoot === null) return 0;
    return this.getHeightOfSubtree(cRoot.left) - this.getHeightOfSubtree(cRoot.right);
  }

  /**
   * Gets the height of the given node
   * @param {Node} cRoot The current root node
   * @return The height of the given node
   */
  getHeightOfSubtree(cRoot) {
    if(cRoot == null) {
      return 0;
    }

    const leftHeight = this.getHeightOfSubtree(cRoot.left);
    const rightHeight = this.getHeightOfSubtree(cRoot.right);

    if(leftHeight > rightHeight) return leftHeight + 1;
    else return rightHeight + 1;
  }

  /**
   * Rotates the given node to the left
   * @param {Node} parent The parent node
   * @return The updated root node
   */
  rotateLeft (parent) {
    let child = parent.right;
    parent.right = child.left;
    child.left = parent;
    return child;
  }

  /**
   * Rotates the given node to the right
   * @param {Node} parent The parent node
   * @return The updated root node
   */
  rotateRight (parent) {
    let child = parent.left;
    parent.left = child.right;
    child.right = parent;
    return child;
  }

  /**
   * Rotates the given node to the left-right
   * @param {Node} cRoot The current root node
   * @return The updated root node
   */
  rotateLeftRight (cRoot) {
    cRoot.left = this.rotateLeft(cRoot.left);
    return this.rotateRight(cRoot);
  }

  /**
   * Rotates the given node to the right-left
   * @param {Node} cRoot The current root node
   * @return The updated root node
   */
  rotateRightLeft (cRoot) {
    cRoot.right = this.rotateRight(cRoot.right);
    return this.rotateLeft(cRoot);
  }

  /**
   * Removes a node with the given value from the AVL Tree
   * @param {int} value The value to remove
   */
  remove(value) {
    this.root = this.removeR(this.root, value);
  }

  /**
   * Recursive function to remove a node with the given value from the AVL Tree
   * @param {Node} cRoot The current root node
   * @param {int} target The value to remove
   * @return The updated root node
   */
  removeR(cRoot, target) {
    if (cRoot === null) {
      return null;
    }

    if (target < cRoot.value) {
      cRoot.left = this.removeR(cRoot.left, target);
    } else if (target > cRoot.value) {
      cRoot.right = this.removeR(cRoot.right, target);
    } else {
      // Case 1: Leaf node (no children)
      // Case 2: Node with one child
      if (cRoot.left === null) {
        return cRoot.right;
      } else if (cRoot.right === null) {
        return cRoot.left;
      }

      // Case 3: Node with two children
      // Find the in-order successor (smallest node in right subtree)
      let successorParent = cRoot;
      let successor = cRoot.right;

      // Find the leftmost node in the right subtree
      while (successor.left !== null) {
        successorParent = successor;
        successor = successor.left;
      }

      // Replace the current node's value with the successor's value
      cRoot.value = successor.value;

      // Remove the successor
      if (successorParent === cRoot) {
        // If successor is immediate right child
        cRoot.right = successor.right;
      } else {
        // If successor is deeper in the tree
        successorParent.left = successor.right;
      }
    }

    return this.balanceTreeAfterRemoval(cRoot);
  }

  /**
   * Balances the AVL Tree after a node is removed
   * @param {Node} cRoot The current root node
   * @return The updated root node
   */
  balanceTreeAfterRemoval(cRoot) {
    if (cRoot == null) {
      return null;
    }

    const balanceFactor = this.getBalanceFactor(cRoot);

    // Left heavy
    if (balanceFactor > 1) {
      const leftBalance = this.getBalanceFactor(cRoot.left);

      // Left-Left case
      if (leftBalance >= 0) {
        return this.rotateRight(cRoot);
      }
      // Left-Right case
      else {
        return this.rotateLeftRight(cRoot);
      }
    }

    // Right heavy
    else if (balanceFactor < -1) {
      const rightBalance = this.getBalanceFactor(cRoot.right);

      // Right-Right case
      if (rightBalance <= 0) {
        return this.rotateLeft(cRoot);
      }
      // Right-Left case
      else {
        return this.rotateRightLeft(cRoot);
      }
    }

    return cRoot;
  }

  /**
   * Initializes the BST with sample data for testing purposes
   * @ignore
   */
  populateWithSampleData() {
    // this.insert(4);
    // this.insert(14);
    // this.insert(18);
    // this.insert(15);
    // this.insert(10);
    // this.insert(11);
    // this.insert(3);
    // this.insert(1);
    // this.insert(2);

    this.insert(1);
    this.insert(2);
    // this.insert(3);
    // this.insert(4);
  }
}