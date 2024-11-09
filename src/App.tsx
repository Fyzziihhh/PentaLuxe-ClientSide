// App.tsx
import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";

const App: React.FC = () => {
  return (
    <Router>
      <Toaster
        position="bottom-center"
        richColors
        closeButton
        expand
        toastOptions={{
          style: {
            fontSize: "1rem", // Equivalent to text-lg
            padding: "1rem", // Equivalent to p-4
            width: "24rem", // Equivalent to w-96
          },
        }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
