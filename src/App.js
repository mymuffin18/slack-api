import LoginForm from './components/LoginForm';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContextProvider';
import ProtectedRoutes from './components/ProtectedRoutes';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import ChannelContextProvider from './context/ChannelContextProvider';
import Channel from './components/Channel';

function App() {
	const { state } = useAuth();
	let redirectRoute;
	if (state.login) {
		redirectRoute = <Navigate replace to='dashboard' />;
	} else {
		redirectRoute = <LoginForm />;
	}
	return (
		<>
			<ChannelContextProvider>
				<BrowserRouter>
					<Routes>
						<Route path='/' element={redirectRoute} />
						<Route
							path='dashboard'
							element={
								<ProtectedRoutes>
									<Dashboard />
								</ProtectedRoutes>
							}
						>
							<Route
								path='channels/:id'
								element={<Channel />}
							/>
						</Route>
						<Route path='register' element={<Register />} />
					</Routes>
				</BrowserRouter>
			</ChannelContextProvider>
		</>
	);
}

export default App;
