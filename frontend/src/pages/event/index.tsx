import "./index.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useFetchWithBody from "../../hooks/useFetchWithBody";
import DeleteEventButton from "./components/DeleteEventButton";
import EditEventButton from "./components/EditEventButton";
import Members from "./components/member/Members";
import AddMember from "./components/member/AddMember";
import AddUserForm from "./components/member/AddUserForm";
import ExpensesTable from "./components/expenses/ExpensesTable";
import { ExpenseType } from "../../types/Expense";

let link: string;

if (import.meta.env.VITE_FAKE_API !== undefined) {
  link = import.meta.env.VITE_FAKE_API;
}

if (import.meta.env.VITE_API !== undefined) {
  link = import.meta.env.VITE_API;
}

const Event = () => {
  const { id_event } = useParams();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [members, setMembers] = useState<string[]>([]);
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
      id_expense: "sldijkbfouabdsfsdfvljhsd8p",
      name: "Łyżwy",
      description:
        "Vestibulum egestas, erat sit amet tincidunt gravida, dolor orci tristique orci, at ullamcorper nulla enim ut tortor. Donec diam risus, lobortis quis libero et, rutrum viverra nisl. Morbi sed leo non est scelerisque bibendum. Suspendisse placerat lobortis augue ultricies iaculis. Phasellus tempor placerat metus, nec interdum nisi. Sed eget augue fermentum urna interdum varius id a mauris. Etiam non sagittis ex. Phasellus fringilla ante ac sapien pellentesque, a cursus dui posuere. Curabitur pharetra eleifend interdum. Vestibulum neque nunc, vulputate ac eros convallis, hendrerit blandit quam. In pulvinar nunc et tortor ultricies tempus. Duis efficitur magna et massa aliquet, ut consectetur diam pretium. Mauris efficitur ultrices ullamcorper. Quisque ultrices fermentum neque, quis pharetra purus ornare sit amet.",
      type: "🎡",
      cost: 50,
      author: "test@test.com",
      date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
    },
    {
      id_expense: "sldijkb123bdsf9u8p",
      name: "Budowanie sanek",
      description:
        "Proin luctus feugiat tellus, quis porttitor lorem dapibus interdum. Donec mi dolor, congue vitae mollis vitae, rutrum id metus. Mauris mi orci, sollicitudin sed sapien eu, convallis blandit purus. Vestibulum vel odio nisi. Aenean vitae feugiat nunc, ut mollis quam. Ut at dolor id neque varius ultrices ut vel ante. Mauris a orci nunc.",
      type: "🛒",
      cost: 300,
      author: "not-test@test.com",
      date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
    },
  ]);

  const [isShowAddExpenseForm, setIsShowAddExpenseForm] = useState(false);

  const handleDeleteExpense = (id_expense: string) => {
    useFetchWithBody("/event/" + id_event + "/expense", "DELETE", localStorage.getItem("token") as string, { id_expense: id_expense })
      .then(() => {
        let newExpenses: ExpenseType[] = [];

        expenses.forEach((exp) => {
          if (exp.id_expense !== id_expense) {
            newExpenses.push(exp);
          }
        });

        setExpenses(newExpenses);
      })
      .catch((e) => {
        console.log("something went wrong");
        console.error(e);
      });
  };

  /* TODO */
  const handleAddExpense = (name: string, description: string, type: string, cash: number) => {
    if (!isShowAddExpenseForm) {
      setIsShowAddExpenseForm(true);
      return;
    }

    useFetchWithBody("/event/" + id_event + "/expense", "POST", localStorage.getItem("token") as string, {
      name: name,
      description: description,
      type: type,
      cash: cash,
    }).then((data) => {
      let newExpens: ExpenseType = {
        id_expense: data.id_expense,
        name: name,
        description: description,
        type: type,
        cash: cash,
        author: data.author,
        date: data.date,
      };
      setExpenses([...expenses, newExpens]);
    });

    setIsShowAddExpenseForm(false);
  };

  const [isShowAddUserForm, setIsShowAddUserForm] = useState(false);

  const handleDeleteEvent = () => {
    useFetch("/event/" + id_event, "DELETE", localStorage.getItem("token") as string)
      .then(() => {
        window.location.href = "/";
      })
      .catch((e) => {
        console.log("something went wrong");
        console.error(e);
      });
  };

  const handleEditEvent = (name: string, description: string) => {
    useFetchWithBody("/event/" + id_event, "PUT", localStorage.getItem("token") as string, { name: name, description: description })
      .then(() => {})
      .catch((e) => {
        console.log("something went wrong");
        console.error(e);
      });
  };

  const handleFinishEvent = () => {};

  const handleClickAddMember = () => {
    setIsShowAddUserForm(true);
  };

  const handleAddUser = (email: string) => {
    useFetchWithBody("/event/" + id_event + "/user", "POST", localStorage.getItem("token") as string, { user_email: email })
      .then(() => {
        setMembers(() => [...members, email]);
      })
      .catch((e) => {
        console.log("something went wrong");
        console.error(e);
      });
    setIsShowAddUserForm(false);
  };

  const handleDeleteMember = (email: string) => {
    useFetchWithBody("/event/" + id_event + "/user", "DELETE", localStorage.getItem("token") as string, { user_email: email })
      .then(() => {
        let newMembers: string[] = [];

        members.forEach((member) => {
          if (member !== email) {
            newMembers.push(member);
          }
        });

        setMembers(() => newMembers);
      })
      .catch((e) => {
        console.log("something went wrong");
        console.error(e);
      });
  };

  useEffect(() => {
    useFetch("/event/" + id_event, "GET", localStorage.getItem("token") as string)
      .then((data) => {
        setName(data.name);
        setDesc(data.description);
        setMembers(data.users);
      })
      .catch((e) => {
        console.log("something went wrong");
        console.error(e);
      });

    useFetch("/event/" + id_event + "/expense", "GET", localStorage.getItem("token") as string)
      .then((data) => {
        setExpenses(data.expenses);
      })
      .catch((e) => {
        console.log("something went wrong");
        console.error(e);
      });
  }, []);

  return (
    <div>
      <Link to={"/"} className="link-back-page">
        🔙
      </Link>
      <h1>{name}</h1>
      <p>{desc}</p>
      <hr />
      <div className="buttons">
        <DeleteEventButton handleDeleteEvent={handleDeleteEvent} />
        <EditEventButton handleEditEvent={handleEditEvent} />
        <div className="finish-event-button global-button-style">
          <button>Finish</button>
        </div>
        <div style={{ clear: "both" }}></div>
      </div>
      <hr />
      <div className="expenses">
        <Link to={"/event/" + id_event + "/expense"} className="link-expense-page">
          <h1>Expenses</h1>
        </Link>
        <ExpensesTable
          expenses={expenses}
          members={members}
          handleDeleteExpense={handleDeleteExpense}
          handleAddExpense={handleAddExpense}
          isShowAddExpenseForm={isShowAddExpenseForm}
        />
      </div>
      <hr />
      <div className="bottom">
        <h1>Members</h1>
        <AddMember handleClickAddMember={handleClickAddMember} isShowAddUserForm={isShowAddUserForm} />
        {isShowAddUserForm ? <AddUserForm handleAddUser={handleAddUser} /> : <></>}
        <Members members={members} handleDeleteMember={handleDeleteMember} />
      </div>
    </div>
  );
};

export default Event;
