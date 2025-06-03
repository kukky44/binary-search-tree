/**
 * Handles rendering of the BST visualization
 * using p5.js, it displayes the current structure of the BST and status of the animation
 */
class IntBSTRenderer {
  /**
   * Creates a new IntBST renderer
   * @constructor
   * @param {p5} p - The p5.js instance
   * @param {IntBST} intBST - The IntBST to render
   * @param {AnimationController} animationController - The animation controller
   */
  constructor(p, intBST, animationController) {
    this.p = p;
    this.intBST = intBST;
    this.aniCon = animationController;

    this.rotateRightImg;
    this.rotateLeftImg;

    // BST rendering constants
    this.NODE_RADIUS = 18;
    this.LEVEL_HEIGHT = 50;
    this.DEFALT_SPACING = 30

    // for animation
    this.ANIMATION_DURATION = 0.6;
  }

  /**
   * Setup the renderer by creating the canvas of p5.js and loading the images
   */
  setup() {
    this.p.createCanvas(CANVAS.WIDTH, CANVAS.HEIGHT);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(13);
    this.rotateRightImg = this.p.loadImage('/binary-search-tree/images/rotate-right.svg');
    this.rotateLeftImg = this.p.loadImage('/binary-search-tree/images/rotate-left.svg');

    this.intBST.populateWithSampleData();
  }

  /**
   * Renders the BST
   */
  render() {
    this.p.clear();
    this.drawIntBST();

    if (this.aniCon.state.animating && this.aniCon.state.mode === 'animate') {
      this.aniCon.animationCount++;
      if (this.aniCon.animationCount % this.aniCon.state.animationSpeed === 0) {
        this.aniCon.nextStep();
      }
    }
  }

  /**
   * Draws the BST visualization
   */
  drawIntBST() {
    // Draw nodes and connections
    this.drawNodes();

    // Draw new node if animating
    this.drawNewAddingNode();

    if(this.aniCon.tempIntBst.root) {
      const tempRoot = this.aniCon.tempIntBst.root;
      this.drawTempBack(tempRoot);
      this.drawTempTree(tempRoot);
    }
  }

  /**
   * Draws all nodes in the BST
   */
  drawNodes() {
    if (this.intBST.root === null && !this.aniCon.state.operation) {
      return this.drawEmptyTree();
    }

    // Adjust starting position based on tree width
    const startX = CANVAS.WIDTH / 2;
    const startY = NODE.DEFAULT_Y;

    this.resizeWidths(this.intBST.root);

    this.setNewPositionsWithAnimation(this.intBST.root, startX, startY, 0);

    // Draw the tree
    this.drawTreeNode(this.intBST.root);
  }

  /**
   * Sets x,y positions to nodes based on calculated widths of the child trees
   * @param {int} cRoot
   * @param {int} xPosition
   * @param {int} yPosition
   * @param {int} side to tell left or right subtree
   */
  setNewPositionsWithAnimation(cRoot, xPosition, yPosition, side){
    if (cRoot === null) return;

    if (side == -1) {
      xPosition = xPosition - cRoot.rightWidth;
    } else if (side == 1) {
      xPosition = xPosition + cRoot.leftWidth;
    }

    let needsAnimation = false;

    const TOLERANCE = 0.01;
    if (cRoot.x !== undefined && Math.abs(cRoot.x - xPosition) > TOLERANCE) {
      needsAnimation = true;
    }

    if (cRoot.y !== undefined && Math.abs(cRoot.y - yPosition) > TOLERANCE) {
      needsAnimation = true;
    }

    if (needsAnimation) {
      this.animateNodePosition(cRoot, xPosition, yPosition);
    } else {
      cRoot.x = xPosition;
      cRoot.y = yPosition;
    }

    this.setNewPositionsWithAnimation(cRoot.left, xPosition, yPosition + this.LEVEL_HEIGHT, -1)
    this.setNewPositionsWithAnimation(cRoot.right, xPosition, yPosition + this.LEVEL_HEIGHT, 1)
  }

  /**
   * Animates a node from current position to the target position
   * @param {Node} node - The node to animate
   * @param {int} targetX - The target x position
   * @param {int} targetY - The target y position
   */
  animateNodePosition(node, targetX, targetY) {
    if (node.x === undefined) node.x = targetX;
    if (node.y === undefined) node.y = targetY;

    // skip animation if it's a previous step
    if(this.aniCon.flags.isPrev) {
      node.x = targetX;
      node.y = targetY;   
      return;     
    }

    gsap.to(node, {
      x: targetX,
      y: targetY,
      duration: this.ANIMATION_DURATION,
      onComplete: () => {
        node.x = targetX;
        node.y = targetY;
      }
    });
  }

  /**
   * Calculates the width of the left and right subtrees of a node
   * @param {Node} cRoot - The current root node
   * @return {int} The width of the left and right subtrees of the node
   */
  resizeWidths(cRoot) {
    if (cRoot == null) {
      return 0;
    }
    cRoot.leftWidth = Math.max(this.resizeWidths(cRoot.left), this.DEFALT_SPACING);
    cRoot.rightWidth = Math.max(this.resizeWidths(cRoot.right), this.DEFALT_SPACING);
    return cRoot.leftWidth + cRoot.rightWidth;
  }

  /**
   * Draws a tree node and its connections
   * @param {Node} node - The node to draw
   */
  drawTreeNode(node) {
    if (node === null) return;

    const animState = this.aniCon.getState();

    // Determine node colors based on animation state
    const { strokeColor, fillColor } = this.getNodeColors(node, animState);

    // Draw connections to children first (so they appear behind nodes)
    if (node.left) {
      this.drawConnection(node, node.left);
      this.drawTreeNode(node.left);
    }

    if (node.right) {
      this.drawConnection(node, node.right);
      this.drawTreeNode(node.right);
    }

    // Draw the node
    this.p.push();
    this.p.fill(fillColor);
    this.p.stroke(strokeColor);
    this.p.strokeWeight(2);
    this.p.circle(node.x, node.y, this.NODE_RADIUS * 2);

    // Draw node value
    this.p.fill(COLORS.TEXT);
    this.p.noStroke();
    this.p.text(node.value, node.x, node.y);
    this.p.pop();
  }

  /**
   * Draws a connection line between parent and child nodes
   * @param {Node} parent - The parent node
   * @param {Node} child - The child node
   */
  drawConnection(parent, child) {
    this.p.push();
    this.p.stroke(COLORS.CONNECT_STROKE);
    this.p.strokeWeight(1);
    this.p.line(parent.x, parent.y, child.x, child.y);
    this.p.pop();


    // Drawing an arrow
    const from = this.p.createVector(parent.x, parent.y);
    const to = this.p.createVector(child.x - parent.x, child.y - parent.y)
    const arrowSize = 6;
    this.p.push();
    this.p.stroke(COLORS.CONNECT_STROKE);
    this.p.strokeWeight(1);
    this.p.fill(COLORS.CONNECT_STROKE);
    this.p.translate(from.x, from.y);
    this.p.line(0, 0, to.x, to.y);
    this.p.rotate(to.heading());
    this.p.translate(to.mag() - arrowSize - this.NODE_RADIUS - 1, 0);
    this.p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    this.p.pop();
  }

  /**
   * Draws an empty tree message when the BST is empty
   */
  drawEmptyTree() {
    this.p.push();
    this.p.fill(COLORS.TEXT);
    this.p.noStroke();
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.text("Please insert a value.", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    this.p.pop();
  }

  /**
   * Gets appropriate colors for a node based on animation state
   * @param {Node} node - Current node being drawn
   * @param {Object} animState - Current animation state
   * @return {Object} Object containing stroke and fill colors
   */
  getNodeColors(node, animState) {
    let strokeColor = this.p.color(COLORS.NODE_STROKE);
    let fillColor = this.p.color(COLORS.NODE_FILL);
    const speed = 0.0012;
    const alpha = this.p.map(this.p.sin(this.p.millis() * speed * this.p.TWO_PI), -1, 1, 0, 255);
    const focusedColor = this.p.color(...COLORS.FOCUS, alpha);
    const currentColor = this.p.color(...COLORS.CURRENT, alpha);
    const sParentColor = this.p.color(...COLORS.SPARENT, alpha);

    if (animState.operation) {
      if (node === this.aniCon.currNode) {
        strokeColor = currentColor;
      }
      if (animState.operation === 'insert') {
        // if (animState.step >= 4 && node.value === animState.value) {
        //   strokeColor = focusedColor;
        //   fillColor = this.p.color(COLORS.HIGHLIGHT);
        // }
      } else if (animState.operation === 'search') {
        if (animState.step >= 1 && node.value === animState.targetNode) {
          strokeColor = focusedColor;
          fillColor = this.p.color(COLORS.HIGHLIGHT);
        }
      } else if (animState.operation === 'remove') {
        if(animState.step >= 7 && node === this.aniCon.currSuccessor) {
          strokeColor = this.p.color(focusedColor);
        }
        if(animState.step >= 8 && node === this.aniCon.currSParent) {
          strokeColor = this.p.color(sParentColor);
        }
      }
    }

    return { strokeColor, fillColor };
  }

  /**
   * Draws the new node being added to the BST
   */
  drawNewAddingNode() {
    const animState = this.aniCon.getState();

    if (!animState.operation || animState.step < 0) return;

    if (animState.operation === 'insert' && this.aniCon.displayNew) {
      // const speed = 0.0012;
      // const alpha = this.p.map(this.p.sin(this.p.millis() * speed * this.p.TWO_PI), -1, 1, 0, 255);
      // const newNodeStroke = this.p.color(...COLORS.FOCUS, alpha);
      const newNodeStroke = this.p.color(COLORS.FOCUS);

      // Draw new node that will be inserted
      this.p.push();
      this.p.fill(COLORS.NODE_FILL);
      this.p.stroke(newNodeStroke);
      this.p.strokeWeight(2);
      this.p.circle(NEW_NODE.X, NEW_NODE.Y, this.NODE_RADIUS * 2);

      // Draw node value
      this.p.fill(COLORS.TEXT);
      this.p.noStroke();
      this.p.text(animState.value, NEW_NODE.X, NEW_NODE.Y);
      this.p.pop();
    }
  }

  /**
   * Draws the temp tree (the tree of the current node being highlighted)
   * @param {Node} node - The node to draw
   */
  drawTempTree(node) {
    if (node === null) return;

    const animState = this.aniCon.getState();

    // // Determine node colors based on animation state
    const { strokeColor, fillColor } = this.getNodeColors(node, animState);

    // Draw connections to children first (so they appear behind nodes)
    if (node.left) {
      this.drawConnection(node, node.left);
      this.drawTempTree(node.left);
    }

    if (node.right) {
      this.drawConnection(node, node.right);
      this.drawTempTree(node.right);
    }

    // Draw the node
    this.p.push();
    this.p.fill(fillColor);
    this.p.stroke(strokeColor);
    this.p.strokeWeight(2);
    this.p.circle(node.x, node.y, this.NODE_RADIUS * 2);

    // Draw node value
    this.p.fill(COLORS.TEXT);
    this.p.noStroke();
    this.p.text(node.value, node.x, node.y);
    this.p.pop();


    if(animState.operation === 'balance' || animState.operation === 'balanceRm') {
      const currN = this.aniCon.currNode;
      if(node === currN) {
        // Draw balance factor
        this.drawBalanceFactor(node, this.aniCon.balanceFactor);

        if(this.aniCon.flags.rotateRight) {
          this.p.image(this.rotateRightImg, currN.x - ROTATE_IMG.OFFSET_LELFT, currN.y - ROTATE_IMG.OFFSET_Y, ROTATE_IMG.SIZE, ROTATE_IMG.SIZE);
        }

        if(this.aniCon.flags.rotateLeft) {
          this.p.image(this.rotateLeftImg, currN.x + ROTATE_IMG.OFFSET_RIGHT, currN.y - ROTATE_IMG.OFFSET_Y, ROTATE_IMG.SIZE, ROTATE_IMG.SIZE);
        }
      }

      if(animState.operation === 'balanceRm') {
        if(this.aniCon.leftBalance !== null && node === currN.left) {
          this.drawBalanceFactor(node, this.aniCon.leftBalance);
        }
        if(this.aniCon.rightBalance !== null && node === currN.right) {
          this.drawBalanceFactor(node, this.aniCon.rightBalance);
        }
      }

      if(this.aniCon.flags.rotateLeftRight && node === currN.left) {
        this.p.image(this.rotateLeftImg, node.x + ROTATE_IMG.OFFSET_RIGHT, node.y - ROTATE_IMG.OFFSET_Y, ROTATE_IMG.SIZE, ROTATE_IMG.SIZE);
      }

      if(this.aniCon.flags.rotateRightLeft && node === currN.right) {
        this.p.image(this.rotateRightImg, node.x - ROTATE_IMG.OFFSET_LELFT, node.y - ROTATE_IMG.OFFSET_Y, ROTATE_IMG.SIZE, ROTATE_IMG.SIZE);
      }
    }
  }

  /**
   * Draws the balance factor of a node
   * @param {Node} node - The target node to draw the balance factor
   * @param {int} factor - The balance factor of the node
   */
  drawBalanceFactor(node, factor) {
    this.p.push();
    this.p.fill(COLORS.BALANCE);
    this.p.noStroke();
    this.p.textSize(10);
    this.p.text('Balance factor: ' + factor, node.x, node.y - 24);
    this.p.pop();
  }

  /**
   * Draws the temp back (the background of the current node (tree) being highlighted)
   * @param {Node} node - The target node to draw the temp back
   */
  drawTempBack(node) {
    const pos = {
      x: node.x,
      y: node.y,
      endX: node.x,
      endY: node.y
    }
    this.getTempBackSize(node, pos);
    const size = this.NODE_RADIUS + 25;
    pos.x -= size;
    pos.y -= size;
    pos.endX += size;
    pos.endY += size;
    this.p.push();
    this.p.fill(255);
    this.p.strokeWeight(2);
    this.p.stroke(COLORS.CURRENT);
    this.p.rect(pos.x, pos.y, pos.endX - pos.x, pos.endY - pos.y, 4);
    this.p.pop();
  }

  /**
   * Gets the size of the temp back by calculating the left bottom and the right bottom of the tree
   * it treverses the tree in-order.
   * @param {Node} node - The target node to get the size of the temp back
   * @param {Object} pos - The position of the temp back
   */
  getTempBackSize(node, pos) {
    if(node === null) {
      return;
    }

    this.getTempBackSize(node.left, pos);
    if(pos.x > node.x) pos.x = node.x;
    if(pos.y > node.y) pos.y = node.y;
    if(pos.endX < node.x) pos.endX = node.x;
    if(pos.endY < node.y) pos.endY = node.y;
    this.getTempBackSize(node.right, pos);
  }
}