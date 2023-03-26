import Member from "./Member";

type Props = {
  members: string[];
};

const Members = ({ members }: Props) => {
  return (
    <div className="members">
      {members.map((member) => {
        return (
          <div className="row">
            <Member member={member} />
            <div style={{ clear: "both" }}></div>
          </div>
        );
      })}
    </div>
  );
};

export default Members;
