// Alter the code with blank to hide it for visualisation-only version
// Keep it only for reuse other js files (not ideal)

const OPERATIONS_SNIPPET = {
  insertCallR: `█
  █
█`,
  insert: {
    code: `█
  █
    █
  █

  █
    █
  █
  █
    █
  █

  █
█`,
    highlightSequence: [
      [0],
      [1],
      [5],
      [8],
      [12],
      []
    ],
    highlightTargets: {
      newNode: [2],
      leftInsert: [6],
      rightInsert: [9],
    }
  },
  removeCallR: `█
  █
█`,
  remove: {
    code: `█
  █
    █
  █

  █
    █
  █
    █
  █
    █
      █
    █
      █
    █

    █
    █

    █
      █
      █
    █

    █

    █
      █
    █
      █
    █
  █

  █
█`,
    highlightSequence: [
      [0],
      [1],
      [5],
      [7],
      [9],
      [10],
      [12],
      [16],
      [17],
      [19],
      [20, 21],
      [24],
      [26],
      ],
      highlightTargets: {
        whileLoop: [9],
        returnNull: [2],
        leftRemove: [6],
        rigthRemove: [8],
        returnCRoot: [33],
        returnRight: [11],
        returnLeft: [13],
        assignToCRoot: [27],
        assignToParent: [29],
    }
  }
}