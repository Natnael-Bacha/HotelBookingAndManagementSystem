import {Routes , Route} from 'react-router';
import AdminSignup from './Pages/AdminSignup';
import AdminSignin from './Pages/AdminSignin';
import AdminDashboard from './Pages/AdminDashboard';

function App() {
 

  return (
    <>
      <Routes>
        <Route path='/' element={<AdminSignin/>}></Route>
        <Route path='/adminSignup' element={<AdminSignup/>}></Route>
        <Route path='/adminSignin' element={<AdminSignin/>}></Route>
        <Route path='/adminDashboard' element={<AdminDashboard/>}></Route>
      </Routes>
    </>
  )
}

export default App
