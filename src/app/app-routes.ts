export const AppRoutes = {
  Login: {
    base: () => "login",    
  },
  Users: {
    base: () => "usuarios",
    CadUsuario: () => { return AppRoutes.Users.base() + "/cad-usuario" },
  },
  Cliente: {
    base: () => "cliente",
    CadCliente: () => { return AppRoutes.Cliente.base() + "/cad-cliente" },
  },
  Imovel: {
    base: () => "imovel",
    CadImovel: () => { return AppRoutes.Imovel.base() + "/cad-imovel" },
  },
};