import { Link, useParams } from "react-router-dom";

const Expense = () => {
  const { id_event } = useParams();

  return (
    <div>
      <Link to={"/event/"}></Link>
    </div>
  );
};

export default Expense;
