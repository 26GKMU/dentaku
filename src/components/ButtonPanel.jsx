import Button from "./Button";
import {BUTTONS} from "../constants/buttons"

function ButtonPanel( {onButtonClick} ){
  return(
    <div className="cButtonArea">
      <div className="cNumButtonArea">
        {[...BUTTONS.TOP,...BUTTONS.OPERAND,"="].map((item,index)=>
          <Button key={index} label={item} onClick={onButtonClick}/>
        )}
      </div>
      <div className="cFunctionButtonArea">
        {["C",...BUTTONS.OPERATOR].map((item,index)=>
          <Button key={index} label={item} onClick={onButtonClick}/>
        )}
      </div>
    </div>  
  );
}
export default ButtonPanel;