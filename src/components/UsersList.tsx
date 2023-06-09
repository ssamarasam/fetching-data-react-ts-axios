import React, { useEffect, useState } from "react";
import { CanceledError } from "../services/api-client";
import UserService, { User } from "../services/user-service";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = UserService.getAll<User>();
    request
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, []);

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter((u) => u.id !== user.id));
    UserService.delete(user.id).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  const addUser = () => {
    let newUser = {
      id: 0,
      name: "Smith",
    };
    setUsers([newUser, ...users]);
    UserService.add(newUser).then((res) => setUsers([res.data, ...users]));
  };

  const updateUser = (user: User) => {
    const originalUsers = [...users];
    const updatedUser = { ...user, name: user.name + "!" };
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
    UserService.update(updatedUser).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };
  return (
    <div>
      {isLoading && <div className="spinner-border"></div>}
      <div className="mb-3">
        <button className="btn btn-outline-danger" onClick={addUser}>
          Add User
        </button>
      </div>
      <h3>Users List:</h3>

      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between"
          >
            {user.name}
            <div>
              <button
                className="btn btn-outline-secondary mx-1"
                onClick={() => updateUser(user)}
              >
                Update
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => deleteUser(user)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;

// const deleteUser = (user: User) => {
//   const originalUsers = [...users];
//   setUsers(users.filter((u) => u.id !== user.id));
//   apiClient.delete("/users/" + user.id).catch((err) => {
//     setError(err.message);
//     setUsers(originalUsers);
//   });
// };

// const addUser = () => {
//   let newUser = {
//     id: 0,
//     name: "Smith",
//   };
//   setUsers([newUser, ...users]);
//   apiClient
//     .post("/users", newUser)
//     .then((res) => setUsers([res.data, ...users]));
// };

// const updateUser = (user: User) => {
//   const originalUsers = [...users];
//   const updatedUser = { ...user, name: user.name + "!" };
//   setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
//   apiClient.patch("/users/" + user.id, updatedUser).catch((err) => {
//     setError(err.message);
//     setUsers(originalUsers);
//   });
// };
