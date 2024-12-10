import "./Card.css";
// this component form the background of the enter app

function Card(props) {
  return (
    <div className="container">
      <div className="topCircle"></div>
      {props.children}
      <div className="bottomCircle"></div>
    </div>
  );
}

export default Card;
