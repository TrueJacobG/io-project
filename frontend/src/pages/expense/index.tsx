import "./index.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import ExpensesTable from "./components/ExpensesTable";
import { ExpenseType } from "../../types/Expense";

const Expense = () => {
  const { id_event } = useParams();

  const [expenses, setExpenses] = useState<ExpenseType[]>([]);

  useEffect(() => {
    useFetch("/event/" + id_event + "/expense", "GET", localStorage.getItem("token") as string)
      .then((exp) => {
        setExpenses(exp.expenses);
      })
      .catch((e) => {
        console.log("something went wrong");
        console.error(e);
      });
  }, []);

  return (
    <div>
      <Link to={"/event/" + id_event} className="link-back-page">
        🔙
      </Link>
      {expenses.length > 0 && <ExpensesTable expenses={expenses} />}
    </div>
  );
};

export default Expense;
