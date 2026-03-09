import { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const SignupForm = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login with:", email);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4 text-center">Đăng ký</h2>
            <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Mật khẩu" type="password" />
            <Input label="Xác nhận lại mật khẩu" type="password" />
            <Button type="submit" className="w-full mt-2">Đăng ký</Button>
        </form>
    );
};
export default SignupForm;