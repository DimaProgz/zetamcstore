import Link from "next/link"
import { XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentFailurePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-red-100 rounded-full p-4 w-fit">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold mt-6">Ошибка оплаты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">К сожалению, ваш платеж не прошел. Деньги не были списаны.</p>
          <p className="text-muted-foreground text-sm">
            Вы можете попробовать еще раз или связаться с нашей поддержкой, если проблема повторится.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button asChild className="w-full bg-transparent" variant="outline">
              <Link href="/#shop">Попробовать снова</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/contacts">Связаться с поддержкой</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
