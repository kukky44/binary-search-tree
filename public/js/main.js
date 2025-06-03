/**
 * @fileoverview
 * Main file for the BST visualization,
 * it initializes the BST, UI, code display, and animation controller
 * it also handles the event listeners for the buttons and inputs
 */

const intBST = new IntBST();
const uiController = new UIController();
const codeDisplayManager = new CodeDisplayManager();
const rsController = new RecursionStackController();
let aniCon;

if(typeof AvlAnimationController == 'function') {
  aniCon = new AvlAnimationController(intBST, codeDisplayManager, uiController, rsController);
} else {
  aniCon = new AnimationController(intBST, codeDisplayManager, uiController, rsController);
}

const treeSketch = function(p) {
  const renderer = new IntBSTRenderer(p, intBST, aniCon);
  p.setup = renderer.setup.bind(renderer);
  p.draw = renderer.render.bind(renderer);
}

const treeViewDiv = document.getElementById('tree-visualization');
const rsViewDiv = document.getElementById('rs-visualization');

const treeView = new p5 (treeSketch, treeViewDiv);

const errorMsgEl = document.getElementById('errorMsg');

function validate(value, input, isRemove) {
  if(isRemove && intBST.head === null) {
    errorMsgEl.classList.remove('hide');
    errorMsgEl.textContent = 'Please add a node to the list.';
    return false;
  } else {
    errorMsgEl.classList.add('hide');
  }

  if(isNaN(value)) {
    errorMsgEl.classList.remove('hide');
    errorMsgEl.textContent = 'Please input a number.';
    input.value = '';
    input.focus();
    return false;
  }
  errorMsgEl.classList.add('hide');
  return true;
}

/**
 * Initializes the event listeners for the buttons and inputs
 */
window.onload = function () {
  window.addEventListener('keydown', (e) => {
    if(e.key == "ArrowRight") {
      uiController.nextBtn.click();
    }
  });

  window.addEventListener('keydown', (e) => {
    if(e.key == "ArrowLeft") {
      uiController.prevBtn.click();
    }
  });

  uiController.addBtn.forEach(button => {
    button.addEventListener('click', function() {
      const input = this.previousElementSibling;
      const value = input.value;
      if(!validate(value, input)) return;

      if (value) {
        aniCon.startInsertAnimation(value);
      }
    });
  });

  uiController.removeBtn.forEach(button => {
    button.addEventListener('click', function() {
      const input = this.previousElementSibling;
      const value = input.value;
      if(!validate(value, input, true)) return;

      if (value) {
        aniCon.startRemoveAnimation(value);
      }
    });
  });

  uiController.nextBtn.addEventListener('click', aniCon.nextStep);
  uiController.prevBtn.addEventListener('click', aniCon.prevStep);

  document.getElementById('step').addEventListener('change', function () {
    aniCon.state.mode = 'step';
    aniCon.state.animating = false;
  });

  document.getElementById('animate').addEventListener('change', function () {
    aniCon.state.mode = 'animate';
    if (aniCon.state.operation) {
      aniCon.state.animating = true;
    }
  });

  document.getElementById('uml-view-toggle').addEventListener('change', () => {
    document.getElementById('uml-table').classList.toggle('hide');
    document.getElementById('normal-view').classList.toggle('hide');
  });

  uiController.skipBtn.addEventListener('click', () => {
    aniCon.skipAnimation();
  });

  // Update both inputs when the value is changed
  const removeInputs = document.querySelectorAll('.remove-input');
  removeInputs.forEach((el) => {
    el.addEventListener('change', function(e) {
      removeInputs.forEach(inp => {
        inp.value = e.target.value;
      })
    })
  });

  const addInputs = document.querySelectorAll('.add-input');
  addInputs.forEach((el) => {
    el.addEventListener('change', function(e) {
      addInputs.forEach(inp => {
        inp.value = e.target.value;
      })
    })
  });

  const visTabs = document.querySelectorAll('.vis-tabs-btn');
  visTabs.forEach(el => {
    el.addEventListener('click', function(e) {
      visTabs.forEach(ta => {
        ta.classList.remove('active');
      });

      e.target.classList.add('active');

      if(e.target.dataset.type === 'tree') {
        treeViewDiv.classList.remove('hide');
        rsViewDiv.classList.add('hide');
        treeView.loop();
      } else {
        treeViewDiv.classList.add('hide');
        rsViewDiv.classList.remove('hide');
        treeView.noLoop();
      }
    })
  })

  const codePreviewInsert = document.getElementById('code-preview-insert');
  const codePreviewRemove = document.getElementById('code-preview-remove');
  const codePreviewContainer = document.querySelector('.code-preview-container');
  const codePreviewTitle = document.querySelector('.code-preview-item-title-text');
  const codePreviewItem = document.querySelector('.code-preview-item');
  const codePreviewItemContent = document.querySelector('.code-preview-item-content');
  const codePreviewClose = document.querySelector('.code-preview-item-title-close');

  codePreviewContainer.addEventListener('click', (e) => {
    e.stopPropagation();
    codePreviewContainer.classList.add('hide');
  }); 

  codePreviewItem.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  codePreviewClose.addEventListener('click', () => {
    codePreviewContainer.classList.add('hide');
  });

  codePreviewInsert.addEventListener('click', () => {
    codePreviewContainer.classList.remove('hide');
    codePreviewTitle.textContent = 'Insert operation code';
    codePreviewItemContent.innerHTML = `
    <pre>${OPERATIONS_SNIPPET.insertCallR}</pre>
    <pre>${OPERATIONS_SNIPPET.insert.code}</pre>
    `;
  });

  codePreviewRemove.addEventListener('click', () => {
    codePreviewContainer.classList.remove('hide');
    codePreviewTitle.textContent = 'Remove operation code';
    codePreviewItemContent.innerHTML = `
    <pre>${OPERATIONS_SNIPPET.removeCallR}</pre>
    <pre>${OPERATIONS_SNIPPET.remove.code}</pre>
    `;
  });
};