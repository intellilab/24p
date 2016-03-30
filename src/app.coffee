$ = (selector) -> document.querySelector selector

mainPanel = $ '#main'
resultsPanel = $ '#results'
inputs = [].slice.call mainPanel.querySelectorAll 'input[type=tel]'

generateHTML = (results) ->
  results.map (result, i) ->
    "<div class=result>
      <span class=result-num>#{i+1}.</span>
      <span class=result-exp>#{result}</span>
      <span class=result-val>=24</span>
    </div>"
  .join ''

document.addEventListener 'DOMContentLoaded', (e) ->
  tfp = new TwentyFourPoints
  mainPanel.addEventListener 'submit', (e) ->
    do e.preventDefault
    numbers = inputs.map (input) -> input.value
    try
      results = tfp.find numbers
      resultsPanel.innerHTML = generateHTML results
    catch e
      console.error e
      resultsPanel.innerHTML = '输入有误！'
