(() => {
  const display = document.getElementById('display');
  const history = document.getElementById('history');
  const keys = document.querySelector('.keys');

  let current = '0';
  let previous = null;
  let operator = null;
  let awaitingNext = false;

  function updateDisplay(){ display.value = current; }

  function inputNumber(num){
    if(awaitingNext){ current = num; awaitingNext = false; }
    else current = current === '0' ? num : current + num;
    updateDisplay();
  }

  function inputDecimal(){
    if(awaitingNext){ current = '0.'; awaitingNext = false; }
    else if(!current.includes('.')) current += '.';
    updateDisplay();
  }

  function handleOperator(nextOp){
    const inputValue = parseFloat(current);
    if(operator && awaitingNext){ operator = nextOp; return; }
    if(previous === null){ previous = inputValue; }
    else if(operator){
      const result = operate(previous, inputValue, operator);
      previous = result;
      current = String(result);
      updateDisplay();
    }
    operator = nextOp;
    awaitingNext = true;
    history.textContent = `${previous} ${symbolFor(operator)}`;
  }

  function symbolFor(op){ return ({add:'+',subtract:'−',multiply:'×',divide:'÷'})[op]||'' }

  function operate(a,b,op){
    if(op === 'add') return a + b;
    if(op === 'subtract') return a - b;
    if(op === 'multiply') return a * b;
    if(op === 'divide') return b === 0 ? 'Error' : a / b;
    return b;
  }

  function clearAll(){ current='0'; previous=null; operator=null; awaitingNext=false; history.textContent=''; updateDisplay(); }

  function toggleNeg(){ if(current==='0') return; current = String(parseFloat(current) * -1); updateDisplay(); }

  function percent(){ current = String(parseFloat(current) / 100); updateDisplay(); }

  keys.addEventListener('click', e => {
    const t = e.target;
    if(t.matches('[data-number]')) inputNumber(t.dataset.number);
    if(t.matches('[data-action="decimal"]')) inputDecimal();
    if(t.matches('[data-action="clear"]')) clearAll();
    if(t.matches('[data-action="negate"]')) toggleNeg();
    if(t.matches('[data-action="percent"]')) percent();
    if(t.matches('[data-action="equals"]')){
      if(operator == null) return;
      const result = operate(previous, parseFloat(current), operator);
      current = String(result);
      history.textContent = '';
      operator = null; previous = null; awaitingNext = false; updateDisplay();
    }
    if(t.matches('.op')){
      handleOperator(t.dataset.action);
    }
  });

  // teclado
  window.addEventListener('keydown', e => {
    if(/\d/.test(e.key)) inputNumber(e.key);
    if(e.key === '.') inputDecimal();
    if(e.key === 'Backspace') current = current.slice(0,-1) || '0', updateDisplay();
    if(e.key === 'Enter' || e.key === '=') document.querySelector('[data-action="equals"]').click();
    if(e.key === '+') handleOperator('add');
    if(e.key === '-') handleOperator('subtract');
    if(e.key === '*') handleOperator('multiply');
    if(e.key === '/') handleOperator('divide');
    if(e.key === '%') percent();
  });

  updateDisplay();
})();
