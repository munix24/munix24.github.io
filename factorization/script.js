function multiplyNumbers() {
    const number1Input = document.getElementById('number1');
    const number2Input = document.getElementById('number2');
    const resultDiv = document.getElementById('result');
  
    const number1 = parseFloat(number1Input.value);
    const number2 = parseFloat(number2Input.value);
  
    if (isNaN(number1) || isNaN(number2)) {
      resultDiv.textContent = 'Please enter valid numbers.';
      return;
    }
  
    const product = number1 * number2;
    resultDiv.textContent = `The product of ${number1} and ${number2} is ${product}.`;
  }
  