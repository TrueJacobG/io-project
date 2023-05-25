import { MemberType } from "../../../../types/MemberType";
import DeleteMember from "./DeleteMember";

type Props = {
  archived: boolean;
  member: MemberType;
  handleDeleteMember: (email: string) => void;
};

const Member = ({ archived, member, handleDeleteMember }: Props) => {
  const handleClickDeleteMember = () => {
    handleDeleteMember(member.email);
  };

  const classDiv = archived ? "member-name-archived" : "member-name";

  return (
    <div className="member" key={Math.random()}>
      <div className={classDiv}>
        <p className="member-username">{member.username}</p>
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
