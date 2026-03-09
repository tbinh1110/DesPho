import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-white shadow p-4 mb-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">MyApp</h1>
            <nav className="flex gap-4">
                <Link to="/" className="text-blue-600">Home</Link>
                <Link to="/editor" className="text-blue-600">Editor</Link>
                <Link to="/profile" className="text-blue-600">Profile</Link>
                <Link to="/login" className="text-red-500">Logout</Link>
                <Link to="/community" className="...">
                    <Users size={20} /> Cộng Đồng
                </Link>
            </nav>
        </header>
    );
};
export default Header;