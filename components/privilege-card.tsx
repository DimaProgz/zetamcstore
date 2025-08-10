"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Shield, Crown, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { handlePurchase } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

export interface Privilege {
  name: string
  price: number
  prefix: string
  features: string[]
  other: string[]
  includesLower?: boolean
  isFeatured?: boolean
}

export function PrivilegeCard({ name, price, prefix, features, other, includesLower, isFeatured }: Privilege) {
  const [nickname, setNickname] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const onPurchaseClick = async () => {
    if (!nickname.trim() || nickname.length < 3) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите корректный никнейм (мин. 3 символа).",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      const result = await handlePurchase(nickname, name)
      if (result.testMode) {
        toast({
          title: "Тестовый режим",
          description: `Товар '${name}' был выдан игроку ${nickname} без оплаты.`,
          className: "bg-yellow-200 text-black",
        })
      } else if (result.success && result.paymentUrl) {
        window.location.href = result.paymentUrl
      } else {
        throw new Error("Не удалось получить ссылку для оплаты.")
      }
    } catch (error) {
      toast({
        title: "Произошла ошибка",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getIcon = () => {
    if (isFeatured) return <Crown className="h-6 w-6 text-yellow-400" />
    if (price > 500) return <Star className="h-6 w-6 text-amber-400" />
    return <Shield className="h-6 w-6 text-primary" />
  }

  return (
    <Card
      className={cn(
        "bg-gray-950/50 backdrop-blur-sm border-border flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50",
        isFeatured && "border-2 border-primary shadow-xl shadow-primary/30",
      )}
    >
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-3 mb-2">
          {getIcon()}
          <CardTitle className="text-2xl font-bold text-primary">{name}</CardTitle>
        </div>
        <p className="text-gray-400">
          Префикс: <span className="font-mono">{prefix} ВашНик</span>
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-lg">Возможности:</h4>
          <ul className="space-y-2 text-gray-300">
            {features.map((feat, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-lg">Прочее:</h4>
          <ul className="space-y-2 text-gray-300">
            {other.map((o, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <span>{o}</span>
              </li>
            ))}
            {includesLower && (
              <li className="flex items-start gap-2 font-semibold text-green-300">
                <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                <span>Возможности всех привилегий ниже</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4 pt-6 border-t border-border/70">
        <div className="text-center text-3xl font-bold text-white">
          {price} <span className="text-xl text-gray-400">руб.</span>
        </div>
        <Input
          type="text"
          placeholder="Введите ваш ник"
          className="bg-gray-900 border-gray-600 placeholder:text-gray-500 focus:border-primary focus:ring-primary"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <Button
          onClick={onPurchaseClick}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-green-700 text-white font-bold text-lg py-6 transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? "Переходим к оплате..." : "Купить"}
        </Button>
      </CardFooter>
    </Card>
  )
}
