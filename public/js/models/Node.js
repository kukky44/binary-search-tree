/**
 * Represents a node in a BST
 */
class Node {
  /**
   * Creates a new Node for a BST, including the value, left, and right children
   * @constructor
   * @param {int} value - The value to store in this node
   */
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
