const DeleteMember = ({ handleClickDeleteMember }: { handleClickDeleteMember: any }) => {
  return (
    <div className="global-button-style">
      <button onClick={handleClickDeleteMember}>Delete</button>
    </div>
  );
};

export default DeleteMember;
