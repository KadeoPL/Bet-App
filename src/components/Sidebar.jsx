import { Sidebar } from "flowbite-react";
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function SidebarNav (){
    const { user, logout } = useContext(UserContext);

    return (
        <Sidebar>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
          <Sidebar.Item as={Link} to="/Home">
              Home
            </Sidebar.Item>
            <Sidebar.Item as={Link} to="/UsersList">
              Użytkownicy
            </Sidebar.Item>
            <Sidebar.Item>
              {user && <button onClick={logout}>Logout</button>}
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    )
}