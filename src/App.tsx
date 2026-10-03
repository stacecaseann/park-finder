import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ParksPage from "./pages/ParksPage";
import ParkDetailsPage from "./pages/ParkDetailsPage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="parks" element={<ParksPage />} />
        <Route path="parks/:id" element={<ParkDetailsPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;
