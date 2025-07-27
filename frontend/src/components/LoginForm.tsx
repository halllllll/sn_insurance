import { type FC, useActionState } from "react";
import { useAuth } from "./AuthProvider";

export const LoginForm: FC = () => {
	const { loginWithGoogle } = useAuth();

	const [loginState, formAction, isPending] = useActionState(
		loginWithGoogle,
		null,
	);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			{!isPending ? (
				<form className="flex flex-col items-center">
					<button
						type="submit"
						className="btn btn-neutral"
						formAction={formAction}
						disabled={isPending}
					>
						ログイン
					</button>
				</form>
			) : (
				<div className="flex items-center justify-center">
					<span className="loading loading-spinner loading-lg"></span>
				</div>
			)}
		</div>
	);
};
