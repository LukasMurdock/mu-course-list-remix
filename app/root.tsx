import type { MetaFunction } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	NavLink,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'
import styles from './styles/app.css'

export function links() {
	return [{ rel: 'stylesheet', href: styles }]
}

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'MU Course List',
	viewport: 'width=device-width,initial-scale=1',
})

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<nav className="m-auto flex max-w-prose justify-between py-4">
					<h1 className="font-bold">
						<NavLink to={'/'}>MU Course List</NavLink>
					</h1>
				</nav>
				<Outlet />
				<footer className="m-auto flex max-w-prose justify-between pt-20 pb-4 text-sm font-medium text-gray-500">
					<p>
						Made by{' '}
						<a
							href="https://lukasmurdock.com/"
							className="text-black underline"
						>
							Lukas Murdock
						</a>
					</p>
				</footer>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
