const DeleteExpense = ({ handleDeleteExpense, id_expense }: { handleDeleteExpense: any; id_expense: string }) => {
  return (
    <div className="delete-expense-button global-button-style">
      <button
        onClick={() => {
          handleDeleteExpense(id_expense);
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default DeleteExpense;
