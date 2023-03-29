import "./index.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import ExpensesTable from "./components/ExpensesTable";
import { ExpenseType } from "../../types/Expense";

const Expense = () => {
  const { id_event } = useParams();

  const [expenses, setExpenses] = useState<ExpenseType[]>([
    {
      id_expense: "sldijkbfouabdsf9u8p",
      name: "Pizza w Zgierzu",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem",
      type: "🍕",
      cost: 80,
      author: "test@test.com",
      date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
    },
    {
      id_expense: "sldijkb123f9u8p",
      name: "Łyżwy",
      description:
        "Vestibulum egestas, erat sit amet tincidunt gravida, dolor orci tristique orci, at ullamcorper nulla enim ut tortor. Donec diam risus, lobortis quis libero et, rutrum viverra nisl. Morbi sed leo non est scelerisque bibendum. Suspendisse placerat lobortis augue ultricies iaculis. Phasellus tempor placerat metus, nec interdum nisi. Sed eget augue fermentum urna interdum varius id a mauris. Etiam non sagittis ex. Phasellus fringilla ante ac sapien pellentesque, a cursus dui posuere. Curabitur pharetra eleifend interdum. Vestibulum neque nunc, vulputate ac eros convallis, hendrerit blandit quam. In pulvinar nunc et tortor ultricies tempus. Duis efficitur magna et massa aliquet, ut consectetur diam pretium. Mauris efficitur ultrices ullamcorper. Quisque ultrices fermentum neque, quis pharetra purus ornare sit amet.",
      type: "🎡",
      cost: 50,
      author: "test@test.com",
      date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
    },
    {
      id_expense: "sldijkbfghjsf9u8p",
      name: "Budowanie sanek",
      description:
        "Proin luctus feugiat tellus, quis porttitor lorem dapibus interdum. Donec mi dolor, congue vitae mollis vitae, rutrum id metus. Mauris mi orci, sollicitudin sed sapien eu, convallis blandit purus. Vestibulum vel odio nisi. Aenean vitae feugiat nunc, ut mollis quam. Ut at dolor id neque varius ultrices ut vel ante. Mauris a orci nunc.",
      type: "🛒",
      cost: 300,
      author: "not-test@test.com",
      date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
    },
  ]);

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
