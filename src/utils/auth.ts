
export function getUserRole() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

 try {
    const decoded = decode(token) 
    if (!decoded.sub) {
      console.error("O campo 'sub' está ausente no token JWT.");
      return null;
    }
    const authoritiesMatch = decoded.sub.match(/Granted Authorities=\[(.*?)\]/);
    if (!authoritiesMatch) {
      console.error("Formato inesperado no campo 'sub' do token JWT.");
      return null;
    }
    const authorities = authoritiesMatch[1];
    localStorage.setItem("loginRole", authorities);
    console.log("Login Role:", authorities); // Exibe o valor no console
    return authorities; // Exemplo: "ROLE_ADMIN"
  } catch (error) {
    console.error("Erro ao decodificar o token JWT:", error);
    return null;
  }
  
}

function decode(token: string) {
    try {
        return JSON.parse(window.atob(token.split(".")[1]));
    } catch (e) {
        console.warn("Error decoding token");
    }
}
