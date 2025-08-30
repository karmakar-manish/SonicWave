import LoginForm from "../../components/auth/LoginForm"

export default function LoginPage()
{
    return (
        <div className="w-full border p-10 flex justify-center flex-col items-center">
            <div className="text-3xl">
                Login page
            </div>
            <div>
                <LoginForm/>
            </div>
        </div>
    )
}