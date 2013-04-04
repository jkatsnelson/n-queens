var solveNRooks = function(n, solution){
//if no solution, create n arrays of n members.
  if (!solution){
    solution = [];
    for (var i=0; i<n; i++){
      solution[i] = [];
      for (var j=0; j<n; j++){
        solution[i][j] = false;
      }
    }
  }




  window.chessboardView.model.setSimpleBoard(solution);
  return solution;
};