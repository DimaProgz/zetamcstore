"use client"

import { useState, useEffect } from "react"
import { verifyAdminPassword, getTestModeStatus, setTestModeStatus } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isTestMode, setIsTestMode] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Проверяем, был ли уже введен пароль в этой сессии
    if (sessionStorage.getItem("isAdminAuthenticated") === "true") {
      setIsAuthenticated(true)
    } else {
      handleAuthentication()
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      getTestModeStatus().then(setIsTestMode)
    }
  }, [isAuthenticated])

  const handleAuthentication = async () => {
    const password = prompt("Введите пароль администратора:")
    if (password) {
      const result = await verifyAdminPassword(password)
      if (result.success) {
        setIsAuthenticated(true)
        sessionStorage.setItem("isAdminAuthenticated", "true") // Запоминаем в сессии
        toast({ title: "Аутентификация пройдена" })
      } else {
        toast({ title: "Неверный пароль", variant: "destructive" })
        // Можно добавить редирект на главную
      }
    }
  }

  const handleToggleTestMode = async (enabled: boolean) => {
    try {
      await setTestModeStatus(enabled)
      setIsTestMode(enabled)
      toast({
        title: "Настройки сохранены",
        description: `Тестовый режим ${enabled ? "ВКЛЮЧЕН" : "ВЫКЛЮЧЕН"}.`,
      })
    } catch (error) {
      toast({ title: "Ошибка сохранения", variant: "destructive" })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Требуется аутентификация...</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Панель администратора</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 rounded-lg border p-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="test-mode" className="text-lg">
                Тестовый режим
              </Label>
              <p className="text-sm text-muted-foreground">
                Если включено, товары будут выдаваться без реальной оплаты для проверки RCON команд.
              </p>
            </div>
            <Switch id="test-mode" checked={isTestMode} onCheckedChange={handleToggleTestMode} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
