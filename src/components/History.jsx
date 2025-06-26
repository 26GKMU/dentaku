function History( {history,delHistory} ){
  return(
    <>
      <ul>
        {history.map((value,index) => (<li key={index}>{value}<button className="min-button" onClick={() => delHistory(index)}>×</button></li>))}
      </ul>
    </>
  );
}
export default History;