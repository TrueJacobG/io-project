import DeleteMember from "./DeleteMember";

type Props = { archived: boolean; member: any; handleDeleteMember: any };

const Member = ({ archived, member, handleDeleteMember }: Props) => {
  const handleClickDeleteMember = () => {
    handleDeleteMember(member.email);
  };

  return (
    <div className="member" key={Math.random()}>
      <div className="member-name">
        <p className="member-name">{member.username}</p>
      </div>
      <div className="delete-member">
        {(localStorage.getItem("email") as string) !== member.email && !archived && (
          <DeleteMember handleClickDeleteMember={handleClickDeleteMember} />
        )}
      </div>
    </div>
  );
};

export default Member;
