const AddExpense = ({ handleAddExpense }: { handleAddExpense: any }) => {
  return (
    <div className="global-button-style">
      <button
        onClick={() => {
          handleAddExpense();
        }}
      >
        Add
      </button>
    </div>
  );
};

export default AddExpense;
