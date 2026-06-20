import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      login: {
        title: "Entrar no GESTOKE",
        subtitle: "Acesso Total / Administrador",
        userLabel: "Usuário",
        passwordLabel: "Senha",
        forgotPassword: "Esqueci a Senha",
        invalidCredentials: "Credenciais inválidas. Verifique os dados fornecidos.",
        errorConnection: "Erro de conexão. Tente novamente mais tarde.",
        connecting: "Conectando...",
        accessSystem: "Acessar Sistema",
        forgotPasswordAlert: "Um email de recuperação foi enviado para o administrador."
      },
      menu: {
        dashboard: "Dashboard",
        inventory: "Estoque",
        invoices: "Faturas",
        clients: "Clientes",
        suppliers: "Fornecedores",
        reports: "Relatórios",
        settings: "Configurações"
      },
      common: {
        managedBy: "Gerenciado e desenvolvido pelo",
        adminName: "Administrador GESTOKE",
        fullAccess: "Acesso Total"
      }
    }
  },
  en: {
    translation: {
      login: {
        title: "Log in to GESTOKE",
        subtitle: "Full Access / Administrator",
        userLabel: "Username",
        passwordLabel: "Password",
        forgotPassword: "Forgot Password?",
        invalidCredentials: "Invalid credentials. Please check the provided data.",
        errorConnection: "Connection error. Please try again later.",
        connecting: "Connecting...",
        accessSystem: "Log in",
        forgotPasswordAlert: "A recovery email has been sent to the administrator."
      },
      menu: {
        dashboard: "Dashboard",
        inventory: "Inventory",
        invoices: "Invoices",
        clients: "Clients",
        suppliers: "Suppliers",
        reports: "Reports",
        settings: "Settings"
      },
      common: {
        managedBy: "Managed and developed by",
        adminName: "GESTOKE Administrator",
        fullAccess: "Full Access"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt", // default language
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
