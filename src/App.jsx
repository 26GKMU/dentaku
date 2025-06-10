import './App.css';
import {useState} from "react" ;
import Display from "./components/Display";
import ButtonPanel from "./components/ButtonPanel";
import {BUTTONS} from "./constants/buttons";
import {toToken, toRPN, evalRPN} from "./utils/culcRPN";

function App() {

  const [display,setDisplay] = useState("0");
  const [errorMessage, setErrorMessage] =useState("");
  const [isDecimal, setIsDecimal] = useState(false);
  const [isLastBlockNotZero, setIsLastBlockNotZero] = useState(false);

  const getLastChar = () => display.slice(-1);
  const isLastCharOperator = () => BUTTONS.OPERATOR.includes(getLastChar());

  const handleButtonClick = (value) => handlers[value]?.();
  const onclickNum = (value) => {
    if (value === "(") {
      if (!isLastCharOperator() && getLastChar() !== "("){ 
        if (display !== "0" || (getLastChar() !== "0" && !isLastBlockNotZero))return;
      }
    }

    if (value === ")") {
      const parenthesesCount = display.split("(").length - display.split(")").length;
      if (parenthesesCount <= 0) return;

      if (isLastCharOperator() || getLastChar() === "(") return;
    }

    if (value === ".") {
      if (!isDecimal&&!isLastCharOperator()) {
        setDisplay(display + value);
        setIsDecimal(true);
        setIsLastBlockNotZero(true);
      }
    }else{
      const needsReplace = display === "0" || (getLastChar() === "0" && !isLastBlockNotZero);
      setDisplay((needsReplace ? display.slice(0, -1) : display) + value);
      setIsLastBlockNotZero(true);
    }
    setErrorMessage("");
  }
  const onclickOperator = (value) =>{
    if(value==="C"){
      setDisplay("0");
    }else{
      setDisplay(
        isLastCharOperator() ? display.slice(0,-1) + value : display + value
      );
    }
    setIsDecimal(false);
    setIsLastBlockNotZero(false);
    setErrorMessage("");
  }
  const onclickCulc = () =>{
    setErrorMessage("");
    if(display.split("(").length != display.split(")").length){
      setErrorMessage("括弧の数が合いません");
      return;
    }
    
    try {
      const tokens = toToken(display);
      const rpn = toRPN(tokens);
      if(!rpn||!rpn.length) throw new Error("式が不正です");

      const result = evalRPN(rpn);
      if ( Number.isNaN(result) || !isFinite(result)) throw new Error("計算ができません");

      setDisplay(result.toString());
    }catch(e){
      setDisplay("0");
      setErrorMessage("Error:"+ e.message);
    }
  }
  const onclickBS = () =>{
    setDisplay(display.slice(0, -1) || "0");
    setErrorMessage("");
  }
  const handlers ={
  ...BUTTONS.OPERAND.reduce((acc, key) => ({ ...acc, [key]: () => onclickNum(key) }), {}),
  ...BUTTONS.TOP.reduce((acc, key) => ({ ...acc, [key]: () => onclickNum(key) }), {}),
  ...BUTTONS.OPERATOR.reduce((acc, key) => ({ ...acc, [key]: () => onclickOperator(key) }), {}),
    "C": () => onclickOperator("C"),
    "=": () => onclickCulc(),
    "←": () => onclickBS(),
  }

  return (
    <div className="cBody">
      <Display display={display} error={errorMessage} />
      <ButtonPanel onButtonClick={handleButtonClick}/>
    </div>
  );
}

export default App;
