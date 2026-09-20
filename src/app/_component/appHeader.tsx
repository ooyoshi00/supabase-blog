"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-blue-600 text-white">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/"
                className={`hover:text-blue-200 transition-colors ${
                  pathname === "/" ? "font-bold" : ""
                }`}
              >
                ホーム
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className={`hover:text-blue-200 transition-colors ${
                  pathname === "/blogs" ? "font-bold" : ""
                }`}
              >
                ブログ
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
