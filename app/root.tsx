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
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
