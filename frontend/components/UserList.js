import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../store/userSlice"; 

const UserList = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.userList); 

    useEffect(() => {
        dispatch(fetchUsers()); 
    }, [dispatch]);

    return (
        <ul>
            {users.map((user) => (
                <li key={user._id}>
                    {user.name} - {user.email}
                </li>
            ))}
        </ul>
    );
};

export default UserList;