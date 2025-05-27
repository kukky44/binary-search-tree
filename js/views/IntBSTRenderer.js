/**
 * Handles rendering of the IntBST visualization
 */
class IntBSTRenderer {
  /**
   * Creates a new IntBST renderer
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
  }

  /**
   * Setup the renderer
   */
  setup() {
    this.p.createCanvas(CANVAS.WIDTH, CANVAS.HEIGHT);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(13);
    this.rotateRightImg = this.p.loadImage('images/rotate-right.svg');
    this.rotateLeftImg = this.p.loadImage('images/rotate-left.svg');

    this.intBST.populateWithSampleData();
  }

  /**
   * Renders the IntBST
   */
  render() {
    this.p.clear();
    this.drawIntBST();

    if (this.aniCon.state.animating && this.aniCon.state.mode === 'animate') {
      this.aniCon.animationCount++;
      if (this.aniCon.animationCount % this.aniCon.state.animationSpeed === 0) {
        // Advance every second
        this.aniCon.nextStep();
      }
    }
  }

  /**
   * Draws the IntBST visualization
   */
  drawIntBST() {
    // Draw nodes and connections
    this.drawNodes();

    // Draw new node if animating
    this.drawNewAddingNode();

    if(this.aniCon.tempIntBst.root) {
      const addingRoot = this.aniCon.tempIntBst.root;
      this.setNewPositions(addingRoot, addingRoot.x, addingRoot.y, 0);
      this.drawInsertingBack(addingRoot);
      this.drawInsertingTree(addingRoot);
    }
  }

  /**
   * Draws all nodes in the IntBST
   */
  drawNodes() {
    if (this.intBST.root === null) {
      return this.drawEmptyTree();
    }

    // Adjust starting position based on tree width
    const startX = CANVAS.WIDTH / 2;
    const startY = NODE.DEFAULT_Y;

    this.resizeWidths(this.intBST.root);

    this.setNewPositions(this.intBST.root, startX, startY, 0);

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
  setNewPositions(cRoot, xPosition, yPosition, side){
    if (cRoot != null) {
      cRoot.y = yPosition;

      if (side == -1) {
        xPosition = xPosition - cRoot.rightWidth;
      } else if (side == 1) {
        xPosition = xPosition + cRoot.leftWidth;
      }

      cRoot.x = xPosition;
      this.setNewPositions(cRoot.left, xPosition, yPosition + this.LEVEL_HEIGHT, -1)
      this.setNewPositions(cRoot.right, xPosition, yPosition + this.LEVEL_HEIGHT, 1)
    }
  }

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
   */
  drawConnection(parent, child) {
    this.p.push();
    this.p.stroke(COLORS.CONNECT_STROKE);
    this.p.strokeWeight(1);
    this.p.line(parent.x, parent.y, child.x, child.y);
    this.p.pop();


    // Drawing an arrow
    // const from = this.p.createVector(parent.x, parent.y);
    // const to = this.p.createVector(child.x - parent.x, child.y - this.NODE_RADIUS)
    // const arrowSize = 7;
    // this.p.push();
    // this.p.stroke(COLORS.CONNECT_STROKE);
    // this.p.strokeWeight(1);
    // this.p.fill(COLORS.CONNECT_STROKE);
    // this.p.translate(from.x, from.y);
    // this.p.line(0, 0, to.x, to.y);
    // this.p.rotate(to.heading());
    // this.p.translate(to.mag() - arrowSize, 0);
    // this.p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    // this.p.pop();
  }

  /**
   * Draws an empty tree message
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
   * @returns {Object} - Object containing stroke and fill colors
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

  drawInsertingTree(node) {
    if (node === null) return;

    const animState = this.aniCon.getState();

    // // Determine node colors based on animation state
    const { strokeColor, fillColor } = this.getNodeColors(node, animState);

    // Draw connections to children first (so they appear behind nodes)
    if (node.left) {
      this.drawConnection(node, node.left);
      this.drawInsertingTree(node.left);
    }

    if (node.right) {
      this.drawConnection(node, node.right);
      this.drawInsertingTree(node.right);
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

  drawBalanceFactor(node, factor) {
    this.p.push();
    this.p.fill(COLORS.BALANCE);
    this.p.noStroke();
    this.p.textSize(10);
    this.p.text('Balance factor: ' + factor, node.x, node.y - 24);
    this.p.pop();
  }

  drawInsertingBack(node) {
    const pos = {
      x: node.x,
      y: node.y,
      endX: node.x,
      endY: node.y
    }
    this.getInsertingBackPos(node, pos);
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

  getInsertingBackPos(node, pos) {
    if(node === null) {
      return;
    }

    this.getInsertingBackPos(node.left, pos);
    if(pos.x > node.x) pos.x = node.x;
    if(pos.y > node.y) pos.y = node.y;
    if(pos.endX < node.x) pos.endX = node.x;
    if(pos.endY < node.y) pos.endY = node.y;
    this.getInsertingBackPos(node.right, pos);
  }
}