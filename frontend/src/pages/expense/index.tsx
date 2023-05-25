import "./index.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import ExpensesTable from "./components/ExpensesTable";
import { ExpenseType } from "../../types/Expense";
import GoBackButton from "./components/GoBackButton";
import Loading from "./components/loading/Loading";

const Expense = ({ archived }: { archived: boolean }) => {
  const { idEvent } = useParams();

  const [expenses, setExpenses] = useState<ExpenseType[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    useFetch("/event/" + idEvent + "/expense", "GET", localStorage.getItem("token") as string)
      .then((exp) => {
        setExpenses(exp.expenses);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        console.error("something went wrong");
        console.error(e);
      });
  }, []);

  return (
    <div>
      <GoBackButton archived={archived} idEvent={idEvent === undefined ? "" : idEvent} />
      {isLoading ? <Loading /> : <ExpensesTable expenses={expenses} />}
    </div>
  );
};

export default Expense;
