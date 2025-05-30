const intBST = new IntBST();
const uiController = new UIController();
const codeDisplayManager = new CodeDisplayManager();
const rsController = new RecursionStackController();

const aniCon = new AnimationController(intBST, codeDisplayManager, uiController, rsController);

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

window.onload = function () {
  // new p5(sketch, document.getElementById('visualization'));

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
};