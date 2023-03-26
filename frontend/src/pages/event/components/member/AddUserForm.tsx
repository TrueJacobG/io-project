import { useState } from "react";

const AddUserForm = ({ handleAddUser }: { handleAddUser: any }) => {
  const [email, setEmail] = useState("");

  return (
    <div className="add-user-form global-button-style">
      <label>Email</label>
      <input type="text" name="emailMember" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <button onClick={() => handleAddUser(email)}>Add member</button>
    </div>
  );
};

export default AddUserForm;
