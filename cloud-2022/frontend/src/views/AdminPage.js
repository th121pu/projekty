import React, { useContext } from "react";
import userContext from "../contexts/userContext";
import { ProfileData } from "../components/ProfileData";

export default function AdminPage() {
  const { user, setUser } = useContext(userContext);
  return (
    <div>
      {user.role == "ADMIN" ? (
        <div>
          {" "}
          AdminPage - {user.name} 
          <ProfileData userObjectBE={user} />
        </div>
      ) : (
        <p>You are not admin!</p>
      )}
    </div>
  );
}
