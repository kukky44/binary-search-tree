/**
 * Implements a binary search tree
 */
class IntBST {
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
    this.root = this.insertIntoSubtree(value, this.root);
  }

  /**
   * Recursive function to insert a new node to the BST
   * @param {int} value The value to insert
   * @param {Node} cRoot The current root node
   * @returns The root node after inserting a new node
   */
  insertIntoSubtree(value, cRoot) {
    if(cRoot === null) {
      return new Node(value);
    } else if (value < cRoot.value) {
      cRoot.left = this.insertIntoSubtree(value, cRoot.left);
    } else if (value > cRoot.value) {
      cRoot.right = this.insertIntoSubtree(value, cRoot.right);
    }
    return cRoot;
  }

  /**
   * Checks if the given value exists in the BST
   * @param {int} value The value to search
   * @returns Boolean value if the value exists in the BST
   */
  search(value) {
    return searchSubtree(value, root);
  }

  /**
   * Recursive function to search a value in the BST
   * @param {int} value The value to search
   * @param {Node} cRoot The current root node
   * @returns
   */
  searchSubtree(value, cRoot) {
    if(cRoot === null) return false;
    else if(cRoot.value == value) return true;
    else if(value < cRoot.value) return searchSubtree(value, cRoot.left);
    else if(value > cRoot.value) return searchSubtree(value, cRoot.right);
    return false;
  }

  /**
   * Initializes the BST with sample data
   */
  populateWithSampleData() {
    this.insert(10);
    this.insert(11);
    this.insert(4);
    // this.insert(14);
    // this.insert(13);
    // this.insert(12);
    // this.insert(5);
    // this.insert(6);
    // this.insert(7);
  }
}