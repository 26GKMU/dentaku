import './App.css';
import {useState} from "react" ;
import Display from "./components/Display";
import ButtonPanel from "./components/ButtonPanel";
import History from "./components/History";
import {BUTTONS} from "./constants/buttons";
import {toToken, toRPN, evalRPN} from "./utils/culcRPN";

function App() {

  const [display,setDisplay] = useState("0");
  const [history,setHistroy] = useState([]);
  const [showHistory,setShowHistory] = useState(false);
  const [errorMessage, setErrorMessage] =useState("");
  const [isDecimal, setIsDecimal] = useState(false);
  const [isLastBlockNotZero, setIsLastBlockNotZero] = useState(false);
  const [isAfterCulc,setIsAfterCulc] = useState(false);

  const getLastChar = () => display.slice(-1);
  const isLastCharOperator = () => BUTTONS.OPERATOR.includes(getLastChar());

  const handleButtonClick = (value) => handlers[value]?.();
  const toggleShowHistory = () => setShowHistory(!showHistory);
  const onclickNum = (value) => {
    if(isAfterCulc){
      value === "("
        ? setDisplay("(")
        : value === "." ||value ===  ")" ? console.log(setDisplay("0")): setDisplay("");
      setIsAfterCulc(false);
    }
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
        setDisplay(prev => prev + value);
        setIsDecimal(true);
        setIsLastBlockNotZero(true);
      }
    }else{
      const needsReplace = display === "0" || (getLastChar() === "0" && !isLastBlockNotZero);
      setDisplay(prev => (needsReplace ? prev.slice(0, -1) : prev) + value);
      setIsLastBlockNotZero(true);
    }
    setErrorMessage("");
  }
  const onclickOperator = (value) =>{
    if(value==="C"){
      setDisplay("0");
    }else{
      setDisplay(
        prev => isLastCharOperator() ? prev.slice(0,-1) + value : prev + value
      );
    }
    setIsDecimal(false);
    setIsLastBlockNotZero(false);
    if(isAfterCulc)setIsAfterCulc(false);
    setErrorMessage("");
  }
  const onclickCulc = () =>{
    setErrorMessage("");
    if(display.split("(").length !== display.split(")").length){
      setErrorMessage("括弧の数が合いません");
      return;
    }
    
    try {
      const tokens = toToken(display);
      const rpn = toRPN(tokens);
      if(!rpn||!rpn.length) throw new Error("式が不正です");

      const result = evalRPN(rpn);
      if ( Number.isNaN(result) || !isFinite(result)) throw new Error("計算ができません");
      history.length <16 
        ? setHistroy([...history,(display+"="+result)])
        : setHistroy([...history.slice(1),(display+"="+result)]);
      setDisplay(result.toString());
      setIsAfterCulc(true);
    }catch(e){
      setDisplay("0");
      setErrorMessage("Error:"+ e.message);
    }
  }
  const onclickBS = () =>{
    setDisplay(prev =>prev.slice(0, -1) || "0");
    setErrorMessage("");
    if(isAfterCulc)setIsAfterCulc(false);
  }
  const delHistory = (i) =>{
    setHistroy(prev => prev.filter((_, index)=>index !== i));

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
    <div className='cFrame'>
      <div className="cBody">
        <Display display={display} error={errorMessage} />
        <ButtonPanel onButtonClick={handleButtonClick}/>
      </div>
      <div className={showHistory ? "cHistory": "cHistory hidden"}>
        <History history={history} delHistory={delHistory}/>
      </div>
      <button className="display-button" onClick={toggleShowHistory}>
        ﾘﾚｷ<div class={showHistory ? "reverse": ""}>≪</div>
      </button>
    </div>
  );
}

export default App;
