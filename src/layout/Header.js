import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import pikachu from "./../assets/pikachu_icon-icons.com_67535.png";

import classes from "./Header.module.css";

const Header = () => {
  const router = useRouter();

  return (
    <div className={classes.header}>
      <Link href="/" className={classes["logo--container"]}>
        <h1 className={classes.logo}>Pokémon</h1>
        <Image 
          src={pikachu} 
          alt="pikachu" 
          className={classes.pikachu}
          width={60}
          height={60}
        />
      </Link>
      <Link href="/blind-quiz" className={classes.link}>
        <nav className={classes.nav}>
          <ul>
            <li className={router.pathname === '/blind-quiz' ? classes.active : ''}>
              Blind Quiz
            </li>
          </ul>
        </nav>
      </Link>
    </div>
  );
};

export default Header;
