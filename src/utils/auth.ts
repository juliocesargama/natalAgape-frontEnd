
export function getUserRole() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

 try {
    const decoded = decode(token) 
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

function decode(token: string) {
    try {
        return JSON.parse(window.atob(token.split(".")[1]));
    } catch (e) {
        console.warn("Error decoding token");
    }
}
