import DeleteMember from "./DeleteMember";

const Member = ({ member }: { member: string }) => {
  return (
    <div className="member" key={Math.random()}>
      <div className="member-name">
        <p className="member-name">{member}</p>
      </div>
      <div className="delete-member">
        <DeleteMember />
      </div>
    </div>
  );
};

export default Member;
