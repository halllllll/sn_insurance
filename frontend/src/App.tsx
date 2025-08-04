import type { FC } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { LoginForm } from "./components/LoginForm";
import { MainApp } from "./components/MainApp";
import { Footer } from "./components/parts/Footer";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<div role="alert">
			<p>エラーが発生しました:</p>
			<pre>{error.message}</pre>
			<button type="button" onClick={resetErrorBoundary}>
				再試行
			</button>
		</div>
	);
}

function AppContent() {
	const { isAuthenticated } = useAuth();

	return (
		// <div className="min-h-[calc(100vh-theme(spacing.16))] mx-auto flex flex-col">
		<div className="min-h-screen mx-auto flex flex-col">
			{isAuthenticated ? <MainApp /> : <LoginForm />}
			<Footer />
		</div>
	);
}

export const App: FC = () => {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<AuthProvider>
				<AppContent />
			</AuthProvider>
		</ErrorBoundary>
	);
};
