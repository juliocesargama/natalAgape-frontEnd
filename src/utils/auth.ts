import { jwtDecode } from "jwt-decode"; // Importação nomeada


export function getUserRole() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token); // Use a função 'jwtDecode'
    if (!decoded.sub) {
      console.error("O campo 'sub' está ausente no token JWT.");
      return null;
    }
    const authoritiesMatch = decoded.authorities;
    if (!authoritiesMatch || !authoritiesMatch.startsWith("ROLE_")) {
      console.error("Formato inesperado no campo 'authorities' do token JWT.");
      return null;
    }
    
    localStorage.setItem("loginRole", authoritiesMatch);
    console.log("Login Role:", authoritiesMatch); // Exibe o valor no console
    return authoritiesMatch; // Exemplo: "ROLE_ADMIN"
  } catch (error) {
    console.error("Erro ao decodificar o token JWT:", error);
    return null;
  }
}