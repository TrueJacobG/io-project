const ArchivedTable = ({ finishedData }: { finishedData: any[] }) => {
  console.log(finishedData);

  return (
    <div className="finished-data-box">
      {finishedData.map((el) => {
        return (
          <div key={Math.random()} className="finished-data">
            {} oddac pieniadze ma {} TODO!
          </div>
        );
      })}
    </div>
  );
};

export default ArchivedTable;
