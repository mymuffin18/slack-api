import LoginForm from './components/LoginForm';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContextProvider';
import ProtectedRoutes from './components/ProtectedRoutes';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import ChannelContextProvider from './context/ChannelContextProvider';
import Channel from './components/Channel';
import UsersContextProvider from './context/UsersContextProvider';
import DirectMessage from './components/DirectMessage';
import Messages from './components/Messages';
import CreateChannel from './components/CreateChannel';

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
				<UsersContextProvider>
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
									path=''
									element={<CreateChannel />}
								/>
								<Route
									path='channels/:id'
									element={<Channel />}
								/>
								<Route
									path='messages/:id'
									element={<Messages />}
								/>
								<Route
									path='messages/'
									element={<DirectMessage />}
								/>
							</Route>
							<Route
								path='register'
								element={<Register />}
							/>
						</Routes>
					</BrowserRouter>
				</UsersContextProvider>
			</ChannelContextProvider>
		</>
	);
}

export default App;
