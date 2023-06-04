import React from "react";
import { MemberType } from "../../../../types/MemberType";
import { FinishedData } from "../../../../types/FinishedData";

type Props = {
  finishedData: FinishedData[];
  members: MemberType[];
  handleClickRefundMoney: (fromEmail: string, toEmail: string, filter: string) => void;
};

const ArchivedTable = ({ finishedData, members, handleClickRefundMoney }: Props) => {
  const formatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

  const handleDebtorReturnedMoney = (element: FinishedData) => {
    const data = { fromEmail: element.payer, toEmail: element.debtors[0].email };
    handleClickRefundMoney(data.fromEmail, data.toEmail, "return");
  };
  const handlePayerReceivedMoney = (element: FinishedData) => {
    const data = { fromEmail: element.payer, toEmail: element.debtors[0].email };
    handleClickRefundMoney(data.fromEmail, data.toEmail, "received");
  };

  console.log(finishedData);

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
        {finishedData.length == 0 ? (
          <h1>Everyone paid!</h1>
        ) : (
          finishedData.map((el) => {
            return (
              <div key={Math.random()} className="finished-data">
                {el.debtors.length > 0 && (
                  <div className="debtor">
                    <h3>{el.payer}</h3>
                    {localStorage.getItem("email") == el.payer && el.debtors[0].cash !== "0" && (
                      <div className="global-button-style debtor-button">
                        <button onClick={() => handleDebtorReturnedMoney(el)}>Returned money!</button>
                      </div>
                    )}
                    {localStorage.getItem("email") == el.debtors[0].email && el.debtors[0].cash === "0" && (
                      <div className="global-button-style payer-button">
                        <button onClick={() => handlePayerReceivedMoney(el)}>Received money!</button>
                      </div>
                    )}
                  </div>
                )}
                {el.debtors !== undefined && (
                  <div className="have-to-pay">
                    <p>{formatter.format(Number(el.debtors[0].cash.replace(",", ".")))}</p>
                    <p>to</p>
                    <p>{el.debtors[0].email}</p>
                  </div>
                )}
                <div style={{ clear: "both" }}></div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ArchivedTable;
