import React from "react";
import { MemberType } from "../../../../types/MemberType";
import { FinishedData } from "../../../../types/FinishedData";

type Props = {
  finishedData: FinishedData[];
  members: MemberType[];
  handleClickRefundMoney: (fromEmail: string, toEmail: string) => void;
};

const ArchivedTable = ({ finishedData, members, handleClickRefundMoney }: Props) => {
  const formatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

  const handleDebtorReturnedMoney = (element: FinishedData) => {
    const data = { fromEmail: element.payer, toEmail: element.debtors[0].email };
    handleClickRefundMoney(data.fromEmail, data.toEmail);
  };
  const handlePayerReceivedMoney = (element: FinishedData) => {
    const data = { toEmail: element.payer, fromEmail: element.debtors[0].email };
    // TODO
  };

  return (
    <div className="finished-data-all-box">
      <h1>Summary</h1>
      <div className="finished-data-box">
        <div className="finished-data">
          <div className="have-to-pay have-to-pay-color">
            <h2>Debtor</h2>
          </div>
          <div className="debtor debtor-color">
            <h2>Payer</h2>
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
        {finishedData.map((el) => {
          return (
            <div key={Math.random()} className="finished-data">
              {el.debtors.length > 0 && (
                <div className="debtor">
                  <h3>{el.payer}</h3>
                  {localStorage.getItem("email") == el.payer && (
                    <div className="global-button-style debtor-button">
                      <button onClick={() => handleDebtorReturnedMoney(el)}>Returned money!</button>
                    </div>
                  )}
                  {localStorage.getItem("email") == el.debtors[0].email && (
                    <div className="global-button-style payer-button">
                      <button onClick={() => handlePayerReceivedMoney(el)}>Received money!</button>
                    </div>
                  )}
                </div>
              )}
              <div className="have-to-pay">
                {el.debtors.map((deb) => {
                  // TODO?
                  return (
                    <React.Fragment key={Math.random()}>
                      <p>{formatter.format(Number(deb.cash.replace(",", ".")))}</p>
                      <p>to</p>
                      <p>{deb.email}</p>
                    </React.Fragment>
                  );
                })}
              </div>
              <div style={{ clear: "both" }}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArchivedTable;
