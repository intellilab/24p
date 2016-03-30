class TwentyFourPoints
  operators: ['+', '-', '*', '/']
  tests: [
    # 共有A(3,3)=6种顺序，但是021和201是等价的，即下面的(2)

    # (1) ((a {op1} b) {op2} c) {op3} d
    (numbers, oprs) ->
      operators = @operators
      exp = numbers[0] + operators[oprs[0]] + numbers[1]
      exp = "(#{exp})" if oprs[0] < 2 and oprs[1] >= 2
      exp += operators[oprs[1]] + numbers[2]
      exp = "(#{exp})" if oprs[1] < 2 and oprs[2] >= 2
      exp += operators[oprs[2]] + numbers[3]

    # (2) (a {op1} b) {op2} (c {op3} d)
    (numbers, oprs) ->
      operators = @operators
      exp = numbers[0] + operators[oprs[0]] + numbers[1]
      exp = "(#{exp})" if oprs[0] < 2 and oprs[1] >= 2
      tmp = numbers[2] + operators[oprs[2]] + numbers[3]
      tmp = "(#{tmp})" if oprs[1] >= 2 or oprs[1] < 2 and oprs[2] < 2
      exp += operators[oprs[1]] + tmp

    # (3) (a {op1} (b {op2} c)) {op3} d
    (numbers, oprs) ->
      operators = @operators
      exp = numbers[1] + operators[oprs[1]] + numbers[2]
      exp = "(#{exp})" if oprs[0] >= 2 or oprs[0] < 2 and oprs[1] < 2
      exp = numbers[0] + operators[oprs[0]] + exp
      exp = "(#{exp})" if oprs[0] < 2 and oprs[2] >= 2
      exp += operators[oprs[2]] + numbers[3]

    # (4) a {op1} ((b {op2} c) {op3} d)
    (numbers, oprs) ->
      operators = @operators
      exp = numbers[1] + operators[oprs[1]] + numbers[2]
      exp = "(#{exp})" if oprs[1] < 2 and oprs[2] >= 2
      exp += operators[oprs[2]] + numbers[3]
      exp = "(#{exp})" if oprs[0] >= 2 or oprs[0] < 2 and oprs[2] < 2
      exp = numbers[0] + operators[oprs[0]] + exp

    # (5) a {op1} (b {op2} (c {op3} d))
    (numbers, oprs) ->
      operators = @operators
      exp = numbers[2] + operators[oprs[2]] + numbers[3]
      exp = "(#{exp})" if oprs[1] >= 2 or oprs[1] < 2 and oprs[2] < 2
      exp = numbers[1] + operators[oprs[1]] + exp
      exp = "(#{exp})" if oprs[0] >= 2 or oprs[0] < 2 and oprs[1] < 2
      exp = numbers[0] + operators[oprs[0]] + exp
  ]

  validate: (numbers) ->
    if numbers.length is not 4
      throw 'Invalid input numbers!'
    numbers.forEach (input) ->
      number = ~~ input || 0
      if number < 1 or number > 13
        throw 'Invalid input number: ' + input

  find: (numbers, limit) ->
    @validate numbers
    numbers = do numbers.slice
    do numbers.sort
    operators = @operators
    results = []
    while numbers
      for opr in [0 ... 1 << 6]
        oprs = [
          opr & 3,
          opr >>> 2 & 3,
          opr >>> 4,
        ]
        for test in @tests
          exp = test.call @, numbers, oprs
          if @check exp
            results.push exp
            return results if limit and results.length >= limit
      numbers = @next numbers
    results

  check: (exp) ->
    res = eval.call null, exp
    res -= 24
    -.001 < res < .001

  next: (list) ->
    list = do list.slice
    length = list.length
    for i in [length - 2 .. 0]
      if list[i] < list[i + 1]
        break
    return unless ~i
    for j in [length - 1 ... i]
      if list[i] < list[j]
        break
    x = list[i]
    list[i] = list[j]
    list[j] = x
    sum = (i + 1) + (length - 1)
    half = sum / 2
    for j in [i + 1 ... half]
      k = sum - j
      x = list[j]
      list[j] = list[k]
      list[k] = x
    list

module?.exports = TwentyFourPoints
