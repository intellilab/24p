TwentyFourPoints = require '../src/core'

assert = (desc, bool, msg) ->
  process.stdout.write desc + ': '
  if bool
    process.stdout.write 'OK'
  else
    process.stdout.write 'FAILED!'
  process.stdout.write '\n'

tfp = new TwentyFourPoints

results = tfp.find [1, 2, 3, 4]
assert 'Full results', results.length is 242

results = tfp.find [1, 2, 3, 4], 5
assert 'Limit to 5', results.length is 5
