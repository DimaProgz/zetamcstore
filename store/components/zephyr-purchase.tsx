"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Gem } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { handleZephyrPurchase } from "@/app/actions"

export function ZephyrPurchase() {
  const [nickname, setNickname] = useState("")
  const [quantity, setQuantity] = useState(100)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const pricePerZephyr = 0.5
  const totalPrice = (quantity * pricePerZephyr).toFixed(2)

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
      const result = await handleZephyrPurchase(nickname, quantity)
      if (result.success && result.paymentUrl) {
        window.location.href = result.paymentUrl
      } else {
        throw new Error("Не удалось получить ссылку для оплаты.")
      }
    } catch (error) {
      toast({
        title: "Произошла ошибка",
        description: (error as Error).message || "Не удалось начать процесс покупки.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gray-950/50 backdrop-blur-sm border-border border-2 border-primary/50 shadow-xl shadow-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Gem className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-bold">Покупка Зефиров</CardTitle>
        </div>
        <p className="text-gray-400 pt-2">
          Выберите желаемое количество игровой валюты. 1 зефир = {pricePerZephyr} руб.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="nickname-zephyr" className="text-sm font-medium text-gray-300 mb-2 block">
            Ваш игровой ник
          </label>
          <Input
            id="nickname-zephyr"
            type="text"
            placeholder="Введите ник"
            className="bg-gray-900 border-gray-600 placeholder:text-gray-500 focus:border-primary focus:ring-primary"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="quantity-slider" className="text-sm font-medium text-gray-300 mb-4 block">
            Количество зефиров
          </label>
          <Slider
            id="quantity-slider"
            defaultValue={[quantity]}
            max={10000}
            min={10}
            step={10}
            onValueChange={(value) => setQuantity(value[0])}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-bold text-primary">{quantity.toLocaleString("ru-RU")} зефиров</span>
            <span className="text-lg font-bold text-white">К оплате: {totalPrice} руб.</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onPurchaseClick}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-green-700 text-white font-bold text-lg py-6 transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? "Переходим к оплате..." : "Купить зефиры"}
        </Button>
      </CardFooter>
    </Card>
  )
}
