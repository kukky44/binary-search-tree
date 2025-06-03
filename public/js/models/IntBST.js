/**
 * Implements a normal binary search tree
 */
class IntBST {
  /**
   * Creates a new normal binary search tree
   * @constructor
   */
  constructor() {
    this.root = null;
  }

  /**
   * Inserts a new node with the given value to the normal BST
   * @param {*} value - The value to insert
   */
  insert(value) {
    this.root = this.insertIntoSubtree(this.root, value);
  }

  /**
   * Recursive function to insert a new node to the normal BST
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
    return cRoot;
  }

  /**
   * Removes a node with the given value from the normal BST
   * @param {int} value The value to remove
   */
  remove(value) {
    this.root = this.removeR(this.root, value);
  }

  /**
   * Recursive function to remove a node with the given value from the normal BST
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

    return cRoot;
  }

  /**
   * Initializes the BST with sample data for testing purposes
   * @ignore
   */
  populateWithSampleData() {
    this.insert(14);
    this.insert(4);
    this.insert(18);
    // this.insert(15);
    // this.insert(10);
    // this.insert(11);
    // this.insert(3);
    // this.insert(13);
    // this.insert(12);
    // this.insert(5);
    // this.insert(6);
  }
}