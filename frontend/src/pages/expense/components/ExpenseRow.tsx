import React from "react";
import { ExpenseType } from "../../../types/Expense";
import convertTypeToEmoji from "../../event/utils/convertTypeToEmoji";

const ExpenseRow = ({ exp }: { exp: ExpenseType }) => {
  const formatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

  return (
    <React.Fragment>
      <tr>
        <td>{exp.name}</td>
        <td>{convertTypeToEmoji(exp.type)}</td>
        <td>{formatter.format(exp.cash)}</td>
      </tr>
      <tr>
        <td colSpan={4}>
          <div className="bottom-box">
            <div className="description-box">
              <h3>Description</h3>
              <p>{exp.description}</p>
            </div>
            <div className="users-box">
              <table style={{ border: "0em solid black" }}>
                <tbody>
                  <tr>
                    <th style={{ border: "0em solid black" }}>Paid</th>
                  </tr>
                  <tr>
                    <td>{exp.author}</td>
                  </tr>
                  <tr>
                    <th style={{ border: "0em solid black" }}>For</th>
                  </tr>
                  {exp.users.map((u) => {
                    return (
                      <tr key={Math.random()}>
                        <td>{u}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ clear: "both" }}></div>
            <div className="date-box">
              <p>{exp.date}</p>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          <hr />
        </td>
      </tr>
    </React.Fragment>
  );
};

export default ExpenseRow;
