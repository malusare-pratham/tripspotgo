import './MembershipCard.css';

function MembershipCard({ title, price, features }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="price">₹{price}<span>/month</span></div>
      <ul>
        {features.map((f, index) => <li key={index}>✅ {f}</li>)}
      </ul>
      <button className="buy-btn">Choose Plan</button>
    </div>
  );
}

export default MembershipCard;
