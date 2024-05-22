document.addEventListener('DOMContentLoaded', function() {
  adjustDigitInputs('number1-inputs', 12); // Adjust inputs for number1-inputs
  adjustDigitInputs('number2-inputs', 12); // Adjust inputs for number2-inputs
  adjustDigitInputs('product-inputs', 12); // Adjust inputs for product-inputs
  randomizeInputs('number1-inputs'); // Randomize inputs when the page loads
  randomizeInputs('number2-inputs'); // Randomize inputs when the page loads
});

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
    } else if (containerId === 'product-inputs') {
      input.addEventListener('input', getProductFactors);
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
