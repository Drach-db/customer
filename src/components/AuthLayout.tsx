import { Outlet } from 'react-router-dom';
import NavbarFixed from './NavbarFixed';

export default function AuthLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <NavbarFixed />

      {/* Main Content - adjusted for navbar width */}
      <div className="inbox-content flex flex-1 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
}