import { useState } from 'react'

import { useAuth } from '../context/auth'

export default function Home() {
	const [email, setEmail] = useState('')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const { isAuthenticated, wallet, signup, login, logout } = useAuth()

	function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
		setEmail(e.target.value)
	}

	function handleUsername(e: React.ChangeEvent<HTMLInputElement>) {
		setUsername(e.target.value)
	}

	function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
		setPassword(e.target.value)
	}

	const unauthenticatedView = (
		<>
			<label htmlFor="email">Email</label>
			<input
				type="text"
				id="email"
				value={email}
				onChange={handleEmail}
			/>

			<label htmlFor="username">Username</label>
			<input
				type="text"
				id="username"
				value={username}
				onChange={handleUsername}
			/>

			<label htmlFor="password">Password</label>
			<input
				type="text"
				id="password"
				value={password}
				onChange={handlePassword}
			/>

			<button onClick={() => login(email, password)}>Log in</button>
			<button onClick={() => signup(email, username, password)}>
				Sign up
			</button>
		</>
	)

	const authenticatedView = (
		<>
			<p>Account: {wallet?.getAddressString() || 'not found'}</p>
			<button onClick={logout}>Log out</button>
		</>
	)

	return (
		<div className="container">
			<h1 className="title">upperNFT</h1>

			<div className="grid">
				<p>isAuthenticated: {String(isAuthenticated)}</p>
				{isAuthenticated ? authenticatedView : unauthenticatedView}
			</div>
		</div>
	)
}
