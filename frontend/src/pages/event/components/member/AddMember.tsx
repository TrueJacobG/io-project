const AddMember = ({ handleClickAddMember, isShowAddUserForm }: { handleClickAddMember: any; isShowAddUserForm: boolean }) => {
  return (
    <div className="add-member global-button-style">
      <button onClick={handleClickAddMember} hidden={isShowAddUserForm}>
        Add
      </button>
    </div>
  );
};

export default AddMember;
