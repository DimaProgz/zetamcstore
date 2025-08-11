"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { verifyAdminPassword, checkRcon } from "@/app/actions"

export function Footer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuthenticated(sessionStorage.getItem("isAdminAuthenticated") === "true")
    }
  }, [])

  const handleAuthAndCheck = async () => {
    try {
      if (!isAuthenticated) {
        const password = prompt("Введите пароль администратора:")
        if (!password) return
        const res = await verifyAdminPassword(password)
        if (!res.success) {
          toast({ title: "Неверный пароль", variant: "destructive" })
          return
        }
        sessionStorage.setItem("isAdminAuthenticated", "true")
        setIsAuthenticated(true)
        toast({ title: "Аутентификация пройдена" })
      }
      setIsChecking(true)
      const r = await checkRcon()
      if (r?.success) {
        toast({ title: "RCON OK", description: String(r.message ?? "Команда отправлена") })
      } else {
        toast({ title: "RCON ошибка", description: String(r?.message ?? "Неизвестная ошибка"), variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Ошибка", description: String((e as Error).message), variant: "destructive" })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <footer className="bg-background border-t border-border/50 py-8">
      <div className="container mx-auto px-4 text-center text-gray-500">
        <div className="text-sm">
          <p>&copy; {new Date().getFullYear()} ZetaMC. Все права защищены.</p>
          <p className="mt-2">ZetaMC не является аффилированным лицом Mojang AB.</p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-6">
          <Link href="/admin" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">
            Админ панель
          </Link>
          <button
            onClick={handleAuthAndCheck}
            disabled={isChecking}
            className="text-xs px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
            aria-label="Проверить RCON"
          >
            {isChecking ? "Проверяем..." : "Проверить RCON"}
          </button>
        </div>
      </div>
    </footer>
  )
}
