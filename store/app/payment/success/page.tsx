import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold mt-6">Оплата прошла успешно!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Спасибо за вашу покупку! Ваш товар будет выдан на сервере в течение нескольких минут.
          </p>
          <p className="text-muted-foreground text-sm">
            Если товар не пришел, пожалуйста, обратитесь в нашу поддержку.
          </p>
          <Button asChild className="w-full mt-6">
            <Link href="/">Вернуться на главную</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
