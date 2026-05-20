import { Link } from "react-router-dom";
import logo_pic from "/assets/logo_pic.png";
import logo_name from "/assets/logo_name.png";

const Header = () => {
  return (
      <header className="flex items-center justify-between px-6 md:px-12 py-3 fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--background))] shadow-elegant">
        <div className="flex items-center gap-2">
          <img src={logo_pic} alt="SafeDelay" className="h-9 w-9" />
          <img src={logo_name} alt="SafeDelay" className="h-6 w-auto" />
        </div>
        <div>
          <ul className="hidden md:flex items-center gap-6">
            <li>
              <Link to="#home" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                À propos
              </Link>
            </li>
            <li>
              <Link to="#tarifs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Tarifs
              </Link>
            </li>
            <li>
              <Link to="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <Link to="/signin" className="text-sm font-medium text-primary border border-primary rounded-md px-4 py-2 ml-4">
            Se connecter
          </Link>
          <Link to="/signup" className="bg-gradient-primary shadow-elegant text-sm font-medium text-primary-foreground rounded-md px-4 py-2 ml-4">
            S'inscrire
          </Link>
        </div>
      </header>
  )
}

export default Header