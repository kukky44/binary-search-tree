class RecursionStackController {
  /**
   * Creates a new RecursionStackController
   */
  constructor() {
    this.rsVisDiv = document.getElementById('rs-vis');
  }

  clear() {
    this.rsVisDiv.innerHTML = '';
  }

  insert(newItem) {
    const newEl = document.createElement('div');
    const cRoot = document.createElement('div');
    const targetVal = document.createElement('div');
    const action = document.createElement('div');
    let actionLabel;
    if(action === 0) {
      actionLabel = 'Go left';
    }else {
      actionLabel = 'Go right';
    }

    cRoot.innerHTML = `Current Root: <span>${newItem.currNodeVal}</span>`;
    targetVal.innerHTML = `Target value: <span>${newItem.insertVal}</span>`;
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

  pop() {
    this.rsVisDiv.removeChild(this.rsVisDiv.firstElementChild);
    for(const item of this.rsVisDiv.children) {
      item.classList.remove('active');
    }
    this.rsVisDiv.firstElementChild.classList.add('active');
  }

  switch(index) {
    for(const item of this.rsVisDiv.children) {
      item.classList.remove('active');
    }

    this.rsVisDiv.children.item(index).classList.add('active');
  }
}