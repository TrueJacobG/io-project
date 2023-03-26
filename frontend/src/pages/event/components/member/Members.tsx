import Member from "./Member";

type Props = {
  members: string[];
  handleDeleteMember: any;
};

const Members = ({ members, handleDeleteMember }: Props) => {
  return (
    <div className="members">
      {members.map((member) => {
        return (
          <div className="row">
            <Member member={member} handleDeleteMember={handleDeleteMember} />
            <div style={{ clear: "both" }}></div>
          </div>
        );
      })}
    </div>
  );
};

export default Members;
