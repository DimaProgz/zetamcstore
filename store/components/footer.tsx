import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 py-8">
      <div className="container mx-auto px-4 text-center text-gray-500">
        <div className="text-sm">
          <p>&copy; {new Date().getFullYear()} ZetaMC. Все права защищены.</p>
          <p className="mt-2">ZetaMC не является аффилированным лицом Mojang AB.</p>
        </div>
        <div className="mt-6">
          <Link href="/admin" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">
            Админ панель
          </Link>
        </div>
      </div>
    </footer>
  )
}
