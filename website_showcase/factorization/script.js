function adjustDigitInputs(containerId, numDigits) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Clear any existing inputs

  let totalDigits = numDigits;
  if (containerId === 'product-inputs') {
    totalDigits = Math.max(numDigits, 6); // Ensure a minimum of 6 inputs for product-inputs
  }

  for (let i = 0; i < totalDigits; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.max = 9;
    input.value = 0;
    input.classList.add('digit');

    if (containerId === 'number1-inputs' || containerId === 'number2-inputs') {
      input.addEventListener('input', multiplyNumbers);
      // input.addEventListener('change', multiplyNumbers);
	  
      input.addEventListener('mouseenter', () => hoveredInput = input);
      input.addEventListener('mouseleave', () => hoveredInput = null);
	  
      // Add mouse wheel behavior
      input.addEventListener('wheel', (event) => {
        event.preventDefault();
        adjustInputValue(input, event.deltaY < 0 ? 1 : -1);
      });
    } else if (containerId === 'product-inputs') {
      input.addEventListener('input', getProductFactors);
      // input.addEventListener('change', getProductFactors);

      // Add mouse wheel step behavior
      input.addEventListener('mouseenter', () => hoveredInput = input);
      input.addEventListener('mouseleave', () => hoveredInput = null);
	  
      input.addEventListener('wheel', (event) => {
        event.preventDefault();
        adjustInputValue(input, event.deltaY < 0 ? 1 : -1);
      });
    }

    container.prepend(input);
    // Add a text node for comma after every third input node
    if ((i + 1) % 3 === 0 && i !== numDigits - 1) {
      const commaNode = document.createTextNode(',');
      container.prepend(commaNode);
    }
  }
}

function getNumberFromInputs(containerId) {
  const inputs = document.querySelectorAll(`#${containerId} .digit`);
  let numberStr = '';
  inputs.forEach(input => {
    numberStr += input.value;
  });
  return parseInt(numberStr, 10);
}

//TODO: after certain threshhold will use scientific notation, ie: 9.01654581337705e+22, which doesn't show well
function setNumberToInputs(containerId, number) {
  const numberStr = number.toString(); // Format number with commas
  adjustDigitInputs(containerId, numberStr.length); // Adjust the number of inputs as needed
  // alert(number, numberStr);

  // Update values of inputs starting from the rightmost digit
  const allInputs = document.querySelectorAll(`#${containerId} .digit`);
  for (let i = numberStr.length - 1, j = allInputs.length - 1; i >= 0 && j >= 0; i--, j--) {
    allInputs[j].value = numberStr[i] === ',' ? '' : numberStr[i]; // Set value or default to empty for commas
  }
}

function multiplyNumbers() {
  const number1 = getNumberFromInputs('number1-inputs');
  const number2 = getNumberFromInputs('number2-inputs');

  if (isNaN(number1) || isNaN(number2)) {
    alert('Please enter valid numbers.');
    return;
  }

  const product = number1 * number2;
  setNumberToInputs('product-inputs', product);
}

function randomizeInputs(containerId) {
  const inputs = document.querySelectorAll(`#${containerId} .digit`);
  inputs.forEach(input => {
    input.value = Math.floor(Math.random() * 10);
  });
  if (containerId === 'number1-inputs' || containerId === 'number2-inputs') {
    multiplyNumbers(); // Recalculate the product after randomizing inputs
  } else if (containerId === 'product-inputs') {
    getProductFactors(); // Check product factors after randomizing inputs
  }
}

function clearInputs(containerId) {
  const inputs = document.querySelectorAll(`#${containerId} .digit`);
  inputs.forEach(input => {
    input.value = 0;
  });
}

function copyToClipboard(containerId) {
  const number = getNumberFromInputs(containerId).toString();
  const dummyElement = document.createElement('textarea');
  dummyElement.value = number;
  dummyElement.style.position = 'fixed';
  document.body.appendChild(dummyElement);
  dummyElement.select();
  document.execCommand('copy');
  document.body.removeChild(dummyElement);
}

function getProductFactors() {
  const product = getNumberFromInputs('product-inputs');
  const sqrtProduct = Math.sqrt(product);

  for (let i = Math.floor(sqrtProduct); i > 1; i--) {
    if (product % i === 0) {
      const factor1 = i;
      const factor2 = product / i;
      setNumberToInputs('number1-inputs', factor1);
      setNumberToInputs('number2-inputs', factor2);
      return;
    }
  }
}

function adjustInputValue(input, direction) {
  const step = parseFloat(input.step) || 1;
  const min = parseFloat(input.min);
  const max = parseFloat(input.max);
  let value = parseFloat(input.value) || 0;

  value += direction * step;

  if (!isNaN(min)) value = Math.max(min, value);
  if (!isNaN(max)) value = Math.min(max, value);

  input.value = value;

  // Manually dispatch 'input' event
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

document.addEventListener('DOMContentLoaded', function() {
  adjustDigitInputs('number1-inputs', 6); // Adjust inputs for number1-inputs
  adjustDigitInputs('number2-inputs', 6); // Adjust inputs for number2-inputs
  adjustDigitInputs('product-inputs', 6); // Adjust inputs for product-inputs
  randomizeInputs('number1-inputs'); // Randomize inputs when the page loads
  randomizeInputs('number2-inputs'); // Randomize inputs when the page loads
});

//global var to keep track of input being hovered for mouse wheel step functionality
let hoveredInput = null;

// Handle arrow keys on hovered input
window.addEventListener('keydown', (event) => {
  if (!hoveredInput) return;

  if (event.key === "ArrowUp") {
    adjustInputValue(hoveredInput, 1);
    event.preventDefault();
  } else if (event.key === "ArrowDown") {
    adjustInputValue(hoveredInput, -1);
    event.preventDefault();
  }
});