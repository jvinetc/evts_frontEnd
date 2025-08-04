import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/Login";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { TokenContext } from "../context/TokenContext";
import axios from "axios";

// Simular la petición axios
jest.mock("axios");

describe("Login.jsx", () => {
  it("permite login y redirecciona a /publications", async () => {
    const mockUsuario = { name: "Andrés", email: "andres@mail.com" };
    const mockToken = "token123";

    axios.post.mockResolvedValueOnce({
      data: {
        user: mockUsuario,
        token: mockToken,
      },
    });

    const setUsuario = jest.fn();
    const setToken = jest.fn();

    render(
      <AuthContext.Provider value={{ usuario: null, setUsuario }}>
        <TokenContext.Provider value={{ token: null, setToken }}>
          <MemoryRouter initialEntries={["/login"]}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/publications"
                element={<h1>Publications Page</h1>}
              />
            </Routes>
          </MemoryRouter>
        </TokenContext.Provider>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/correo/i), {
      target: { value: "andres@mail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByRole("button", { name: /iniciar/i }));

    await waitFor(() => {
      expect(setUsuario).toHaveBeenCalledWith(mockUsuario);
      expect(setToken).toHaveBeenCalledWith(mockToken);
      expect(screen.getByText(/publications page/i)).toBeInTheDocument();
    });
  });
});
