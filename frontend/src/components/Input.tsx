import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ElementType
}

export default function Input({ icon: Icon, ...props }: InputProps) {
    return <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {Icon && <Icon className="size-5 text-purple-500" />}
        </div>

        <input {...props}
            className="w-full pl-10 pr-3 rounded-lg border p-2 border-blue-200 
            focus:border-blue-200 text-sm 
            bg-pink-100 text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-300
            "
        />
    </div>
}