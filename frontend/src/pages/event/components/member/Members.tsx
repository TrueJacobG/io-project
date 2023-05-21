import React from "react";
import Member from "./Member";

type Props = {
  archived: boolean;
  members: any[];
  handleDeleteMember: any;
};

const Members = ({ archived, members, handleDeleteMember }: Props) => {
  return (
    <div className="members">
      <React.Fragment>
        {members.map((member) => {
          return (
            <div className="row" key={Math.random()}>
              <Member archived={archived} member={member} handleDeleteMember={handleDeleteMember} />
            </div>
          );
        })}
        <div style={{ clear: "both" }}></div>
      </React.Fragment>
    </div>
  );
};

export default Members;
