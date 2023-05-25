import "./index.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useFetchWithBody from "../../hooks/useFetchWithBody";
import DeleteEventButton from "./components/buttons/DeleteEventButton";
import EditEventButton from "./components/buttons/EditEventButton";
import Members from "./components/member/Members";
import AddMember from "./components/member/AddMember";
import AddUserForm from "./components/member/AddUserForm";
import ExpensesTable from "./components/expenses/ExpensesTable";
import { ExpenseType } from "../../types/Expense";
import convertTypeToEmoji from "./utils/convertTypeToEmoji";
import getUsersWithCashBySplitType from "./utils/getUsersWithCash";
import getUsersWithCash from "./utils/getUsersWithCash";
import sum from "./utils/sum";
import FinishEventButton from "./components/buttons/FinishEventButton";
import GoBackButton from "./components/buttons/GoBackButton";
import Loading from "./components/loading/Loading";
import ArchivedTable from "./components/archived/ArchivedTable";

const Event = ({ archived }: { archived: boolean }) => {
  const { id_event } = useParams();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isShowAddExpenseForm, setIsShowAddExpenseForm] = useState(false);

  const [errorAddExpenseForm, setErrorAddExpenseForm] = useState("");

  const [finishedData, setFinishedData] = useState<any[]>([]);

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
        console.error("something went wrong");
        console.error(e);
      });
  };

  const handleAddExpense = (name: string, description: string, type: string, cash: number, splitCash: number[], users: string[]) => {
    setErrorAddExpenseForm("");

    if (!isShowAddExpenseForm) {
      setIsShowAddExpenseForm(true);
      return;
    }

    if (name.length === 0 || cash === 0 || description.length === 0) {
      setErrorAddExpenseForm("Name/Description can't be empty! Cash can't be equal to 0!");
      return;
    }

    if (cash > 2_000_000) {
      setErrorAddExpenseForm("Cash is too big!");
      return;
    }

    let usersWithCash: any = getUsersWithCash(members, users, splitCash);

    useFetchWithBody("/event/" + id_event + "/expense", "POST", localStorage.getItem("token") as string, {
      name: name,
      description: description,
      type: type,
      cash: cash,
      users: usersWithCash,
    })
      .then((data) => {
        let newExpens: ExpenseType = {
          id_expense: data.id_expense,
          name: name,
          description: description,
          type: convertTypeToEmoji(type),
          cash: cash,
          author: data.author,
          date: data.date,
          users: users,
        };
        setExpenses([...expenses, newExpens]);
        setIsShowAddExpenseForm(false);
      })
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });
  };

  const [isShowAddUserForm, setIsShowAddUserForm] = useState(false);

  const handleDeleteEvent = () => {
    useFetch("/event/" + id_event, "DELETE", localStorage.getItem("token") as string)
      .then(() => {
        window.location.href = "/";
      })
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });
  };

  const handleEditEvent = (name: string, description: string) => {
    useFetchWithBody("/event/" + id_event, "PUT", localStorage.getItem("token") as string, { name: name, description: description })
      .then(() => {})
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });
  };

  const handleFinishEvent = () => {
    useFetch("/event/" + id_event + "/finish", "GET", localStorage.getItem("token") as string)
      .then(() => {
        window.location.href = "/";
      })
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });
  };

  const handleClickAddMember = () => {
    setIsShowAddUserForm(true);
  };

  const handleAddUser = (email: string) => {
    useFetchWithBody("/event/" + id_event + "/user", "POST", localStorage.getItem("token") as string, { user_email: email })
      .then((data) => {
        if (data.username) {
          setMembers(() => [...members, { email: email, username: data.username }]);
        }
      })
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });
    setIsShowAddUserForm(false);
  };

  const handleDeleteMember = (email: string) => {
    useFetchWithBody("/event/" + id_event + "/user", "DELETE", localStorage.getItem("token") as string, { user_email: email })
      .then(() => {
        let newMembers: string[] = [];

        members.forEach((member) => {
          if (member.email !== email) {
            newMembers.push(member);
          }
        });

        setMembers(() => newMembers);
      })
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });
  };

  const handleGetFinishedData = () => {
    useFetch("/event/" + id_event + "/finished_data", "GET", localStorage.getItem("token") as string)
      .then((data) => {
        setFinishedData(data.data);
      })
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });
  };

  useEffect(() => {
    useFetch("/event/" + id_event, "GET", localStorage.getItem("token") as string)
      .then((data) => {
        setName(data.name);
        setDesc(data.description);

        let newMembers: any = [];

        data.users.forEach((u) => {
          if (u.email !== (localStorage.getItem("email") as string)) {
            newMembers.push(u);
          }
        });

        newMembers.splice(0, 0, { email: localStorage.getItem("email") as string, username: localStorage.getItem("username") as string });

        setMembers(newMembers);
      })
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });

    setIsLoading(true);
    useFetch("/event/" + id_event + "/expense", "GET", localStorage.getItem("token") as string)
      .then((data) => {
        let expenses: ExpenseType[] = [];

        [...data.expenses].forEach((exp) => {
          let newExp: ExpenseType = {
            id_expense: exp.id_expense,
            name: exp.name,
            description: exp.description,
            type: convertTypeToEmoji(exp.type),
            cash: exp.cash,
            author: exp.author,
            date: exp.date,
            users: exp.users,
          };
          expenses.push(newExp);
        });

        setExpenses(expenses);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        console.error("something went wrong");
        console.error(e);
      });

    handleGetFinishedData();
  }, []);

  const linkToExpenses = archived ? "/event/archived/" + id_event + "/expense" : "/event/" + id_event + "/expense";

  const styleMembersTitle = archived ? "members-title-archived" : "members-title";

  return (
    <div>
      <h1>{name}</h1>
      <p>{desc}</p>
      <hr />
      <div className="buttons">
        <GoBackButton archived={archived} />
        {!archived && <DeleteEventButton handleDeleteEvent={handleDeleteEvent} />}
        {!archived && <EditEventButton handleEditEvent={handleEditEvent} />}
        {!archived && <FinishEventButton handleFinishEvent={handleFinishEvent} />}
        <div style={{ clear: "both" }}></div>
      </div>

      <div className="expenses">
        <Link to={linkToExpenses} className="link-expense-page">
          <h1>Expenses</h1>
        </Link>
        {isLoading ? (
          <Loading />
        ) : (
          <ExpensesTable
            archived={archived}
            expenses={expenses}
            members={members}
            handleDeleteExpense={handleDeleteExpense}
            handleAddExpense={handleAddExpense}
            isShowAddExpenseForm={isShowAddExpenseForm}
            errorAddExpenseForm={errorAddExpenseForm}
          />
        )}
      </div>
      <div className="bottom">
        <div className="members-title-box">
          <div className={styleMembersTitle}>
            <h1>Members</h1>
          </div>
          <div className="members-title-add">
            {!archived && <AddMember handleClickAddMember={handleClickAddMember} isShowAddUserForm={isShowAddUserForm} />}
          </div>
          <div style={{ clear: "both" }}></div>
        </div>

        {isShowAddUserForm && <AddUserForm handleAddUser={handleAddUser} />}
        <Members archived={archived} members={members} handleDeleteMember={handleDeleteMember} />
      </div>
      {archived && <ArchivedTable finishedData={finishedData} members={members} />}
    </div>
  );
};

export default Event;
