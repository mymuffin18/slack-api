import LoginForm from './components/LoginForm';
import Test from './components/Test';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContextProvider';
import ProtectedRoutes from './components/ProtectedRoutes';
import Dashboard from './components/Dashboard';
import Register from './components/Register';

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
					/>
					<Route path='register' element={<Register />} />
					{/* <Route path='test' element={<Test />} /> */}
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
