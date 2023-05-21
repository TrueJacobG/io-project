import React from "react";

const ArchivedTable = ({ finishedData }: { finishedData: any[] }) => {
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
        {finishedData.map((el) => {
          return (
            <div key={Math.random()} className="finished-data">
              {el.debtors.length > 0 && (
                <div className="debtor">
                  <h3>{el.payer}</h3>
                </div>
              )}
              <div className="have-to-pay">
                {el.debtors.map((deb) => {
                  return (
                    <React.Fragment>
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
