(function(){

  var ChessboardModel = Backbone.Model.extend({
    initialize: function(params){
      if (params.n) {
        this.clearPieces();
      } else {
        this.setSimpleBoard(params.board);
      }
    },

    clearPieces: function(){
      this.set('board', this.makeEmptyBoard());
    },

    setSimpleBoard: function(simpleBoard){
      this.set('board', this.makeBoardFromSimpleBoard(simpleBoard));
      this.set('n', this.get('board').length);
    },

    makeBoardFromSimpleBoard: function(simpleBoard){
      var that = this;
      return _.map(simpleBoard, function(cols, r){
        return _.map(cols, function(hasPiece, c){
          return {
            row: r,
            col: c,
            piece: hasPiece,
            sign: ((r+c)%2),
            inConflict: function(){
              // todo: how expensive is this inConflict() to compute?
              return (
                that.hasRowConflictAt(r) ||
                that.hasColConflictAt(c) ||
                that.hasUpLeftConflictAt(that._getUpLeftIndex(r, c)) ||
                that.hasUpRightConflictAt(that._getUpRightIndex(r, c))
              );
            }
          };
        }, this);
      }, this);
    },

    makeEmptyBoard: function(){
      var board = [];
      _.times(this.get('n'), function(){
        var row = [];
        _.times(this.get('n'), function(){
          row.push(false);
        }, this);
        board.push(row);
      }, this);
      return this.makeBoardFromSimpleBoard(board);
    },

    // we want to see the first row at the bottom, but html renders things from top down
    // So we provide a reversing function to visualize better
    reversedRows: function(){
      return _.extend([], this.get('board')).reverse();
    },

    togglePiece: function(r, c){
      this.get('board')[r][c].piece = !this.get('board')[r][c].piece;
      this.trigger('change');
    },

    _getUpLeftIndex: function(r, c){
      return r + c;
    },

    _getUpRightIndex: function(r, c){
      return this.get('n') - c + r - 1;
    },


    hasRooksConflict: function(){
      return this.hasAnyRowConflict() || this.hasAnyColConflict();
    },

    hasQueensConflict: function(){
      return this.hasRooksConflict() || this.hasAnyUpLeftConflict() || this.hasAnyUpRightConflict();
    },

    _isInBounds: function(r, c){
      return 0 <= r && r < this.get('n') && 0 <= c && c < this.get('n');
    },


    // todo: fill in all these functions - they'll help you!

    hasAnyRowConflict: function(){
      var result = false;
      for (var i = 0; i < this.attributes.board.length; i++) {
        if (this.hasRowConflictAt(i) === true){
          return true;
        }
      }
      return result;
    },

    hasRowConflictAt: function(r){
      var result = false;
      var arrayResult = _(this.attributes.board[r]).filter(function(square) {
        return square.piece === true;
      });
      if ( arrayResult.length > 1 ){
        result = true;
      }
      return result;
    },

    hasAnyColConflict: function(){
      var result = false;
      for (var i = 0; i < this.attributes.board.length; i++) {
        if (this.hasColConflictAt(i) === true){
          return true;
        }
      }
      return result;
    },

    hasColConflictAt: function(c){
      var resultArray = [];
      var result = false;
      _(this.attributes.board).each(function(row) {
        _(row).each(function(square){
          if( square.col === c && square.piece === true) {
            resultArray.push(square.piece);
          }
        });
      });
      if ( resultArray.length > 1 ) {
        result = true;
      }
      return result;
    },

    hasAnyUpLeftConflict: function(){
      var result = false;
      var that = this;

      var bucketArray = _.range(((this.get('board').length - 1) * 2) + 1);
      
      _(bucketArray).each(function(index){
        if (that.hasUpLeftConflictAt(index) === true){
          result = true;
        }
      });

      return result;
    },

    hasUpLeftConflictAt: function(upLeftIndex){
      var result = false;
      var that = this;

      var bucketArray = _.range(((this.get('board').length - 1) * 2) + 1);

      bucketArray = _(bucketArray).map(function(num){
        num = [num,0,0];
        return num;
      });
      _(this.attributes.board).each(function(row) {
        _(row).each(function(square) {
          for (var i = 0; i < bucketArray.length; i++) {
            var upLeftIndexOfSquare = that._getUpLeftIndex(square.col, square.row);
              if(upLeftIndexOfSquare === bucketArray[i][0]){
                if(square.piece === false){
                  bucketArray[i][1] += 1;
                }
                if(square.piece === true){
                  bucketArray[i][2] += 1;
                }
              }
          }
        });
      });
      if(bucketArray[upLeftIndex][2] > 1){
        result = true;
      }
      return result;
    },

    hasAnyUpRightConflict: function(){
      var result = false;
      var that = this;
      
      var bucketArray = _.range(((this.get('board').length - 1) * 2) + 1);

      _(bucketArray).each(function(index){
        if (that.hasUpRightConflictAt(index) === true){
          result = true;
        }
      });

      return result;
    },

    hasUpRightConflictAt: function(upRightIndex){
      var result = false;
      var that = this;
      
      var bucketArray = _.range(((this.get('board').length - 1) * 2) + 1);

      bucketArray = _(bucketArray).map(function(num){
        num = [num,0,0];
        return num;
      });
      _(this.attributes.board).each(function(row) {
        _(row).each(function(square) {
          for (var i = 0; i < bucketArray.length; i++) {
            var upRightIndexOfSquare = that._getUpRightIndex(square.col, square.row);
              if(upRightIndexOfSquare === bucketArray[i][0]){
                if(square.piece === false){
                  bucketArray[i][1] += 1;
                }
                if(square.piece === true){
                  bucketArray[i][2] += 1;
                }
              }
          }
        });
      });
      if(bucketArray[upRightIndex][2] > 1){
        result = true;
      }
      return result;
      // todo
    }
  });

  this.ChessboardModel = ChessboardModel;

}());
