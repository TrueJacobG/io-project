import Member from "./Member";

type Props = {
  archived: boolean;
  members: any[];
  handleDeleteMember: any;
};

const Members = ({ archived, members, handleDeleteMember }: Props) => {
  return (
    <div className="members">
      {members.map((member) => {
        return (
          <div className="row" key={Math.random()}>
            <Member archived={archived} member={member} handleDeleteMember={handleDeleteMember} />
            <div style={{ clear: "both" }}></div>
          </div>
        );
      })}
    </div>
  );
};

export default Members;
