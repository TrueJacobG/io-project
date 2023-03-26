import DeleteMember from "./DeleteMember";

const Member = ({ member, handleDeleteMember }: { member: string; handleDeleteMember: any }) => {
  const handleClickDeleteMember = () => {
    handleDeleteMember(member);
  };

  return (
    <div className="member" key={Math.random()}>
      <div className="member-name">
        <p className="member-name">{member}</p>
      </div>
      <div className="delete-member">
        <DeleteMember handleClickDeleteMember={handleClickDeleteMember} />
      </div>
    </div>
  );
};

export default Member;
