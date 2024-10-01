import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { resetTokenAndCredentials } from "@/store/auth-slice"; // Assuming this action resets token and credentials
import { useNavigate } from "react-router-dom"; // Importing useNavigate

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  function handleLogout() {
    // Dispatch the reset token and credentials action
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear(); // Clear session storage
    navigate("/auth/login"); // Redirect to login page after logout
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
