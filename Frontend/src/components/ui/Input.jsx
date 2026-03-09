const Input = ({ label, type = "text", placeholder, value, onChange }) => {
    return (
        <div className="mb-3">
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}
            <input
                type={type}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};
export default Input;