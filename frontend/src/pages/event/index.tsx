import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./index.css";

import useFetch from "../../hooks/useFetch";
import useFetchWithBody from "../../hooks/useFetchWithBody";
import DeleteEventButton from "./components/buttons/DeleteEventButton";
import EditEventButton from "./components/buttons/EditEventButton";
import Members from "./components/member/Members";
import AddMember from "./components/member/AddMember";
import AddUserForm from "./components/member/AddUserForm";
import ExpensesTable from "./components/expenses/ExpensesTable";
import FinishEventButton from "./components/buttons/FinishEventButton";
import GoBackButton from "./components/buttons/GoBackButton";
import Loading from "./components/loading/Loading";
import ArchivedTable from "./components/archived/ArchivedTable";

import convertTypeToEmoji from "./utils/convertTypeToEmoji";
import getUsersWithCash from "./utils/getUsersWithCash";

import { ExpenseType } from "../../types/Expense";
import { MemberType } from "../../types/MemberType";
import { FinishedData } from "../../types/FinishedData";
import { UserWithCash } from "../../types/UserWithCash";

const Event = ({ archived }: { archived: boolean }) => {
  const { idEvent } = useParams();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [members, setMembers] = useState<MemberType[]>([]);
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [finishedData, setFinishedData] = useState<FinishedData[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isShowAddUserForm, setIsShowAddUserForm] = useState(false);
  const [isShowAddExpenseForm, setIsShowAddExpenseForm] = useState(false);
  const [errorAddExpenseForm, setErrorAddExpenseForm] = useState("");

  const linkToExpenses = archived ? "/event/archived/" + idEvent + "/expense" : "/event/" + idEvent + "/expense";
  const styleMembersTitle = archived ? "members-title-archived" : "members-title";

  const handleDeleteExpense = (idExpense: string) => {
    useFetchWithBody("/event/" + idEvent + "/expense", "DELETE", localStorage.getItem("token") as string, { id_expense: idExpense })
      .then(() => {
        let newExpenses: ExpenseType[] = [];

        expenses.forEach((exp) => {
          if (exp.id_expense !== idExpense) {
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

    let usersWithCash: UserWithCash[] = getUsersWithCash(members, users, splitCash);

    useFetchWithBody("/event/" + idEvent + "/expense", "POST", localStorage.getItem("token") as string, {
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

  const handleDeleteEvent = () => {
    useFetch("/event/" + idEvent, "DELETE", localStorage.getItem("token") as string)
      .then(() => {
        window.location.href = "/";
      })
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });
  };

  const handleEditEvent = (name: string, description: string) => {
    useFetchWithBody("/event/" + idEvent, "PUT", localStorage.getItem("token") as string, { name: name, description: description })
      .then(() => {})
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });
  };

  const handleFinishEvent = () => {
    useFetch("/event/" + idEvent + "/finish", "GET", localStorage.getItem("token") as string)
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
    useFetchWithBody("/event/" + idEvent + "/user", "POST", localStorage.getItem("token") as string, { user_email: email })
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
    useFetchWithBody("/event/" + idEvent + "/user", "DELETE", localStorage.getItem("token") as string, { user_email: email })
      .then(() => {
        let newMembers: MemberType[] = [];

        members.forEach((member) => {
          if (member.email !== email) {
            newMembers.push(member);
          }
        });

        setMembers(newMembers);
      })
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });
  };

  const handleClickRefundMoney = (fromEmail: string, toEmail: string, filter: string) => {
    useFetchWithBody("/event/" + idEvent + "/summary", "POST", localStorage.getItem("token") as string, {
      fromEmail: fromEmail,
      toEmail: toEmail,
    })
      .then((data) => {
        if (filter === "return") {
          filterReturnClicked(fromEmail, toEmail);
        } else {
          filterReceivedClicked(fromEmail, toEmail);
        }
      })
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });
  };

  const filterReturnClicked = (fromEmail: string, toEmail: string) => {
    let newFinishedData: FinishedData[] = [];

    finishedData.forEach((data) => {
      if (data.debtors.length !== 0) {
        if (data.payer === fromEmail) {
          console.log(fromEmail);
          console.log(toEmail);

          let fdata: FinishedData = {
            payer: data.payer,
            debtors: [],
          };
          data.debtors.forEach((deb) => {
            if (deb.email !== toEmail) {
              fdata.debtors.push(deb);
            }
          });
          newFinishedData.push(fdata);
        } else {
          newFinishedData.push(data);
        }
      }
    });

    setFinishedData(newFinishedData);
  };

  const filterReceivedClicked = (fromEmail: string, receivedMoney: string) => {
    let newFinishedData: FinishedData[] = [];

    finishedData.forEach((data) => {
      if (data.payer !== receivedMoney) {
        newFinishedData.push(data);
      }
    });

    setFinishedData(newFinishedData);
  };

  const loadFinishedData = () => {
    useFetch("/event/" + idEvent + "/summary", "GET", localStorage.getItem("token") as string)
      .then((data) => {
        setFinishedData(data.data);
      })
      .catch((e) => {
        console.error("something went wrong");
        console.error(e);
      });
  };

  const loadEventInfoAndMembers = () => {
    useFetch("/event/" + idEvent, "GET", localStorage.getItem("token") as string)
      .then((data) => {
        setName(data.name);
        setDesc(data.description);

        let newMembers: MemberType[] = [];

        data.users.forEach((u: MemberType) => {
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
  };

  const loadExpenses = () => {
    setIsLoading(true);
    useFetch("/event/" + idEvent + "/expense", "GET", localStorage.getItem("token") as string)
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
  };

  useEffect(() => {
    loadEventInfoAndMembers();
    loadExpenses();
    if (archived) {
      loadFinishedData();
    }
  }, []);

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
      {archived && <ArchivedTable finishedData={finishedData} members={members} handleClickRefundMoney={handleClickRefundMoney} />}
    </div>
  );
};

export default Event;
