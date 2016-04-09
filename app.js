(function() {
  var $, TwentyFourPoints, generateHTML, inputs, mainPanel, resultsPanel;

  $ = function(selector) {
    return document.querySelector(selector);
  };

  mainPanel = $('#main');

  resultsPanel = $('#results');

  inputs = [].slice.call(mainPanel.querySelectorAll('input[type=tel]'));

  generateHTML = function(results) {
    return results.map(function(result, i) {
      return "<div class=result> <span class=result-num>" + (i + 1) + ".</span> <span class=result-exp>" + result + "</span> <span class=result-val>=24</span> </div>";
    }).join('');
  };

  document.addEventListener('DOMContentLoaded', function(e) {
    var tfp;
    tfp = new TwentyFourPoints;
    return mainPanel.addEventListener('submit', function(e) {
      var error, numbers, results;
      e.preventDefault();
      numbers = inputs.map(function(input) {
        return input.value;
      });
      try {
        results = tfp.find(numbers);
        return resultsPanel.innerHTML = generateHTML(results);
      } catch (error) {
        e = error;
        console.error(e);
        return resultsPanel.innerHTML = '输入有误！';
      }
    });
  });

  TwentyFourPoints = (function() {
    function TwentyFourPoints() {}

    TwentyFourPoints.prototype.operators = ['+', '-', '*', '/'];

    TwentyFourPoints.prototype.tests = [
      function(numbers, oprs) {
        var exp, operators;
        operators = this.operators;
        exp = numbers[0] + operators[oprs[0]] + numbers[1];
        if (oprs[0] < 2 && oprs[1] >= 2) {
          exp = "(" + exp + ")";
        }
        exp += operators[oprs[1]] + numbers[2];
        if (oprs[1] < 2 && oprs[2] >= 2) {
          exp = "(" + exp + ")";
        }
        return exp += operators[oprs[2]] + numbers[3];
      }, function(numbers, oprs) {
        var exp, operators, tmp;
        operators = this.operators;
        exp = numbers[0] + operators[oprs[0]] + numbers[1];
        if (oprs[0] < 2 && oprs[1] >= 2) {
          exp = "(" + exp + ")";
        }
        tmp = numbers[2] + operators[oprs[2]] + numbers[3];
        if (oprs[1] >= 2 || oprs[1] < 2 && oprs[2] < 2) {
          tmp = "(" + tmp + ")";
        }
        return exp += operators[oprs[1]] + tmp;
      }, function(numbers, oprs) {
        var exp, operators;
        operators = this.operators;
        exp = numbers[1] + operators[oprs[1]] + numbers[2];
        if (oprs[0] >= 2 || oprs[0] < 2 && oprs[1] < 2) {
          exp = "(" + exp + ")";
        }
        exp = numbers[0] + operators[oprs[0]] + exp;
        if (oprs[0] < 2 && oprs[2] >= 2) {
          exp = "(" + exp + ")";
        }
        return exp += operators[oprs[2]] + numbers[3];
      }, function(numbers, oprs) {
        var exp, operators;
        operators = this.operators;
        exp = numbers[1] + operators[oprs[1]] + numbers[2];
        if (oprs[1] < 2 && oprs[2] >= 2) {
          exp = "(" + exp + ")";
        }
        exp += operators[oprs[2]] + numbers[3];
        if (oprs[0] >= 2 || oprs[0] < 2 && oprs[2] < 2) {
          exp = "(" + exp + ")";
        }
        return exp = numbers[0] + operators[oprs[0]] + exp;
      }, function(numbers, oprs) {
        var exp, operators;
        operators = this.operators;
        exp = numbers[2] + operators[oprs[2]] + numbers[3];
        if (oprs[1] >= 2 || oprs[1] < 2 && oprs[2] < 2) {
          exp = "(" + exp + ")";
        }
        exp = numbers[1] + operators[oprs[1]] + exp;
        if (oprs[0] >= 2 || oprs[0] < 2 && oprs[1] < 2) {
          exp = "(" + exp + ")";
        }
        return exp = numbers[0] + operators[oprs[0]] + exp;
      }
    ];

    TwentyFourPoints.prototype.validate = function(numbers) {
      if (numbers.length !== 4) {
        throw 'Invalid input numbers!';
      }
      return numbers.forEach(function(input) {
        var number;
        number = ~~input || 0;
        if (number < 1 || number > 13) {
          throw 'Invalid input number: ' + input;
        }
      });
    };

    TwentyFourPoints.prototype.find = function(numbers, limit) {
      var exp, l, len, m, operators, opr, oprs, ref, ref1, results, test;
      this.validate(numbers);
      numbers = numbers.slice();
      numbers.sort();
      operators = this.operators;
      results = [];
      while (numbers) {
        for (opr = l = 0, ref = 1 << 6; 0 <= ref ? l < ref : l > ref; opr = 0 <= ref ? ++l : --l) {
          oprs = [opr & 3, opr >>> 2 & 3, opr >>> 4];
          ref1 = this.tests;
          for (m = 0, len = ref1.length; m < len; m++) {
            test = ref1[m];
            exp = test.call(this, numbers, oprs);
            if (this.check(exp)) {
              results.push(exp);
              if (limit && results.length >= limit) {
                return results;
              }
            }
          }
        }
        numbers = this.next(numbers);
      }
      return results;
    };

    TwentyFourPoints.prototype.check = function(exp) {
      var res;
      res = eval.call(null, exp);
      res -= 24;
      return (-.001 < res && res < .001);
    };

    TwentyFourPoints.prototype.next = function(list) {
      var half, i, j, k, l, length, m, n, ref, ref1, ref2, ref3, ref4, sum, x;
      list = list.slice();
      length = list.length;
      for (i = l = ref = length - 2; ref <= 0 ? l <= 0 : l >= 0; i = ref <= 0 ? ++l : --l) {
        if (list[i] < list[i + 1]) {
          break;
        }
      }
      if (!~i) {
        return;
      }
      for (j = m = ref1 = length - 1, ref2 = i; ref1 <= ref2 ? m < ref2 : m > ref2; j = ref1 <= ref2 ? ++m : --m) {
        if (list[i] < list[j]) {
          break;
        }
      }
      x = list[i];
      list[i] = list[j];
      list[j] = x;
      sum = (i + 1) + (length - 1);
      half = sum / 2;
      for (j = n = ref3 = i + 1, ref4 = half; ref3 <= ref4 ? n < ref4 : n > ref4; j = ref3 <= ref4 ? ++n : --n) {
        k = sum - j;
        x = list[j];
        list[j] = list[k];
        list[k] = x;
      }
      return list;
    };

    return TwentyFourPoints;

  })();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = TwentyFourPoints;
  }

}).call(this);
