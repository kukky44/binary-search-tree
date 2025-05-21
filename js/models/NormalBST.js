/**
 * Implements a binary search tree
 */
class NormalBST {
  /**
   * Creates a new binary search tree
   */
  constructor() {
    this.root = null;
  }

  /**
   * Inserts a new node with the given value to the BST
   * @param {*} value - The value to insert
   */
  insert(value) {
    this.root = this.insertIntoSubtree(this.root, value);
  }

  /**
   * Recursive function to insert a new node to the BST
   * @param {Node} cRoot The current root node
   * @param {int} value The value to insert
   * @returns The root node after inserting a new node
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
    return cRoot;
  }

  balanceTree(value) {
    this.root = this.balanceTreeHelper(value);
  }

  balanceTreeHelper(value) {
    const balanceFactor = this.getBalanceFactor(this.root);
    if(balanceFactor > 1) {
      if(value < this.root.left.value) {
        return this.rotateRight(this.root);
      }else if(value > this.root.left.value) {
        return this.rotateLeftRight(this.root);
      }

    }else if (balanceFactor < -1) {
      if(value < this.root.right.value) {
        return this.rotateRightLeft(this.root);
      }else if(value > this.root.right.value) {
        return this.rotateLeft(this.root);
      }
    }
    return this.root;
  }

  getBalanceFactor(cRoot) {
    if(cRoot === null) return 0;
    return this.getHeightOfSubtree(cRoot.left) - this.getHeightOfSubtree(cRoot.right);
  }

  getHeightOfSubtree(cRoot) {
    if(cRoot == null) {
      return 0;
    }

    const leftHeight = this.getHeightOfSubtree(cRoot.left);
    const rightHeight = this.getHeightOfSubtree(cRoot.right);

    if(leftHeight > rightHeight) return leftHeight + 1;
    else return rightHeight + 1;
  }

  rotateLeft (parent) {
    let child = parent.right;
    parent.right = child.left;
    child.left = parent;
    return child;
  }

  rotateRight (parent) {
    let child = parent.left;
    parent.left = child.right;
    child.right = parent;
    return child;
  }

  rotateLeftRight (cRoot) {
    cRoot.left = this.rotateLeft(cRoot.left);
    return this.rotateRight(cRoot);
  }

  rotateRightLeft (cRoot) {
    cRoot.right = this.rotateRight(cRoot.right);
    return this.rotateLeft(cRoot);
  }
}