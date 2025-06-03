/**
 * Controls the recursion stack
 */
class RecursionStackController {
  /**
   * Creates a new RecursionStackController
   * @constructor
   */
  constructor() {
    this.rsVisDiv = document.getElementById('rs-vis');
    this.rsStacks = document.getElementById('rs-stacks');

    this.rsStacks.addEventListener('click', (e) => {
      if (e.target.classList.contains('stack-switch-btn')) {
        for(const item of this.rsStacks.children) {
          item.classList.remove('active');
        }

        e.target.classList.add('active');

        const clickedIndex = Array.from(this.rsStacks.children).indexOf(e.target);
        this.currentSwitchFunc(clickedIndex);
      }
    });

    this.currentSwitchFunc = null;
  }

  /**
   * Inserts a new item into the recursion stack
   * @param {function} switchFunc - The function to switch to the clicked item
   */
  insertRsItem = (switchFunc) => {
    this.currentSwitchFunc = switchFunc;

    const newItem = document.createElement('button');
    const index = this.rsStacks.children.length;
    newItem.textContent = index;

    // deactivate all buttons to set the new item active
    for(const item of this.rsStacks.children) {
      item.classList.remove('active');
    }

    newItem.className = 'stack-switch-btn active';
    this.rsStacks.prepend(newItem);
  }

  /**
   * Clears the recursion stack by removing all elements in the visualization.
   */
  clear() {
    this.rsVisDiv.innerHTML = '';
    this.rsStacks.innerHTML = '';
  }

  /**
   * Inserts a new item into the recursion stack
   * @param {object} newItem - The new item to insert
   * @param {function} switchFunc - The function to switch to the clicked item
   */
  insert(newItem, switchFunc) {
    this.insertRsItem(switchFunc);
    const newEl = document.createElement('div');
    const cRoot = document.createElement('div');
    const targetVal = document.createElement('div');
    const action = document.createElement('div');
    let actionLabel;
    if(action === 0) {
      actionLabel = 'Go left';
    }else if(action === 2) {
      actionLabel = 'Call recursive method';
    }else {
      actionLabel = 'Go right';
    }

    cRoot.innerHTML = `Current Root: <span>${newItem.node?.value || "null"}</span>`;
    targetVal.innerHTML = `Target value: <span>${newItem.targetVal}</span>`;
    action.innerHTML = `Action: <span>${actionLabel}</span>`;
    newEl.append(cRoot);
    newEl.append(targetVal);
    newEl.append(action);

    newEl.classList.add('rs-stack-item', 'active');

    for(const item of this.rsVisDiv.children) {
      item.classList.remove('active');
    }

    this.rsVisDiv.prepend(newEl);
  }

  /**
   * Pops an item from the recursion stack, and removes the corresponding item in the visualization.
   */
  pop() {
    this.rsVisDiv.removeChild(this.rsVisDiv.firstElementChild);
    if(this.rsVisDiv.children.length) {
      for(const item of this.rsVisDiv.children) {
        item.classList.remove('active');
      }
      this.rsVisDiv.firstElementChild.classList.add('active');
    }
    this.rsStacks.removeChild(this.rsStacks.firstElementChild);
    if(this.rsStacks.children.length) {
      for( const item of this.rsStacks.children) {
        item.classList.remove('active');
      }
      this.rsStacks.firstElementChild.classList.add('active');
    }
  }

  /**
   * Switches to the clicked item in the recursion stack visualization
   * @param {number} index - The index of the clicked item
   */
  switch(index) {
    for(const item of this.rsVisDiv.children) {
      item.classList.remove('active');
    }

    this.rsVisDiv.children.item(index).classList.add('active');
  }
}