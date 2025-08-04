import type { FC } from "react";

export const Footer: FC = () => {
	return (
		<footer className="footer footer-center p-4 text-base-content mt-auto bg-white shadow-md">
			<aside>
				<p>Copyright © {new Date().getFullYear()} - GIG SCHOOL</p>
			</aside>
		</footer>
	);
};
