import Image from "next/image"
import { CopyIp } from "./copy-ip"

export function Header() {
  return (
    <header className="sticky top-0 md:top-4 z-50 px-4">
      <div className="container mx-auto flex items-center justify-between h-16 rounded-none md:rounded-2xl bg-background/80 backdrop-blur-sm border-b md:border border-border/50 px-6">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="ZetaMC Logo" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold tracking-wider">ZetaMC</span>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            <a
              href="#privileges"
              className="text-gray-300 hover:text-primary transition-colors duration-300 text-sm font-medium"
            >
              Привилегии
            </a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors duration-300 text-sm font-medium">
              Правила
            </a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors duration-300 text-sm font-medium">
              Контакты
            </a>
          </nav>
          <div className="hidden md:block w-px h-6 bg-border/50" />
          <CopyIp ip="play.zetamc.su" />
        </div>
      </div>
    </header>
  )
}
