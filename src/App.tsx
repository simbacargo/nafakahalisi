import { Route, Routes } from "react-router-dom";
import { LegacyNotFound, LegacyPage } from "./components/LegacyPage";

export default function App() {
  return <Routes>
    <Route path="/" element={<LegacyPage language="sw" page="home" />} />
    <Route path="/products/" element={<LegacyPage language="sw" page="products" />} />
    <Route path="/services/" element={<LegacyPage language="sw" page="services" />} />
    <Route path="/about/" element={<LegacyPage language="sw" page="about" />} />
    <Route path="/contact/" element={<LegacyPage language="sw" page="contact" />} />
    <Route path="/en/" element={<LegacyPage language="en" page="home" />} />
    <Route path="/en/products/" element={<LegacyPage language="en" page="products" />} />
    <Route path="/en/services/" element={<LegacyPage language="en" page="services" />} />
    <Route path="/en/about/" element={<LegacyPage language="en" page="about" />} />
    <Route path="/en/contact/" element={<LegacyPage language="en" page="contact" />} />
    <Route path="*" element={<LegacyNotFound />} />
  </Routes>;
}
