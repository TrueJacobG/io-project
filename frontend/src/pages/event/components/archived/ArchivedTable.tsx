import React from "react";
import { Member } from "../../../../types/MemberType";
import { FinishedData } from "../../../../types/FinishedData";

type Props = {
  finishedData: FinishedData[];
  members: Member[];
};

const ArchivedTable = ({ finishedData, members }: Props) => {
  const handleDebtorReturnedMoney = (element: FinishedData) => {
    const data = { payer: element.payer, receiver: element.debtors[0].email };
  };
  const handlePayerReceivedMoney = (element: FinishedData) => {
    const data = { payer: element.payer, receiver: element.debtors[0].email };
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
                      <p>{deb.cash} zł</p>
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
