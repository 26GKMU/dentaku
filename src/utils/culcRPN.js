  export const toToken = (formula) => {
    let token = formula.match(/(\d+\.?\d*|[+\-*/()])/g);
    if(token && token[0]==="-" && token.length > 1){
      token = [token[0]+token[1],...token.slice(2)];
    }
    return token;
  }
export const toRPN = (tokens) => {
  const output = [];
  const stack = [];
  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 };

  tokens.forEach(token => {
    if (!isNaN(token)) {
      output.push(token);
    } else if ("+-*/".includes(token)) {
      while (
        stack.length &&
        "+-*/".includes(stack[stack.length - 1]) &&
        precedence[stack[stack.length - 1]] >= precedence[token]
      ) {
        output.push(stack.pop());
      }
      stack.push(token);
    } else if (token === "(") {
      stack.push(token);
    } else if (token === ")") {
      while (stack.length && stack[stack.length - 1] !== "(") {
        output.push(stack.pop());
      }
      stack.pop(); 
    }
  });

  while (stack.length) {
    output.push(stack.pop());
  }  
  return output;
}

export const evalRPN = (rpnTokens) => {
  const stack = [];

  rpnTokens.forEach(token => {
    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case "+": stack.push(a + b); break;
        case "-": stack.push(a - b); break;
        case "*": stack.push(a * b); break;
        case "/": stack.push(a / b); break;
        default: throw new Error(`Unknown operator: ${token}`);
      }
    }
  });
  return stack[0];
} 