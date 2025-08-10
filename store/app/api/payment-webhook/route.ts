import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { Rcon } from "rcon-client"

// Карта для сопоставления русских названий привилегий с командами на английском
const rankCommandMap: { [key: string]: string } = {
  Рыцарь: "knight",
  Хранитель: "guardian",
  Маг: "mage",
  Искатель: "seeker",
  Вельможа: "noble",
  Император: "emperor",
  Феникс: "phoenix",
  Творец: "creator",
  Владыка: "overlord",
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.CENT_SECRET_KEY
  if (!secretKey) {
    console.error("Секретный ключ Cent.app не настроен.")
    return new NextResponse("Server configuration error", { status: 500 })
  }

  try {
    const signatureHeader = req.headers.get("X-Signature")
    const requestBody = await req.text()
    const expectedSignature = crypto.createHmac("sha256", secretKey).update(requestBody).digest("hex")

    if (signatureHeader !== expectedSignature) {
      console.error("Invalid signature from Cent.app webhook.")
      return new NextResponse("Error: Invalid signature", { status: 400 })
    }

    const data = JSON.parse(requestBody)

    if (data.type !== "payment_success") {
      return NextResponse.json({ status: "ok", message: "Not a success payment notification" })
    }

    const customFields = JSON.parse(data.data.custom_fields)
    const nickname = customFields.nickname
    const orderId = data.data.order_id
    let command = ""

    if (customFields.type === "zephyr") {
      const quantity = customFields.quantity
      command = `p give ${nickname} ${quantity}`
      console.log(`Успешная оплата! Заказ: ${orderId}. Выдача ${quantity} зефиров игроку ${nickname}`)
    } else if (customFields.type === "privilege") {
      const russianRank = customFields.rank
      const commandRank = rankCommandMap[russianRank]

      if (commandRank) {
        command = `lp user ${nickname} parent add ${commandRank}`
        console.log(`Успешная оплата! Заказ: ${orderId}. Выдача привилегии ${russianRank} игроку ${nickname}`)
      } else {
        console.error(`Неизвестная привилегия в вебхуке: ${russianRank}`)
        return NextResponse.json({ status: "ok", message: "Unknown rank" })
      }
    } else {
      console.error(`Unknown product type in webhook: ${customFields.type}`)
      return NextResponse.json({ status: "ok", message: "Unknown product type" })
    }

    // --- НАЧАЛО РЕАЛЬНОЙ ЛОГИКИ RCON ---
    const { RCON_HOST, RCON_PORT, RCON_PASSWORD } = process.env
    if (!RCON_HOST || !RCON_PORT || !RCON_PASSWORD) {
      console.error("RCON данные не настроены в переменных окружения.")
      throw new Error("Server RCON configuration is incomplete.")
    }

    const rcon = new Rcon({
      host: RCON_HOST,
      port: Number.parseInt(RCON_PORT, 10),
      password: RCON_PASSWORD,
    })

    try {
      await rcon.connect()
      console.log(`[RCON] Успешно подключено к ${RCON_HOST}. Отправка команды: "${command}"`)
      const response = await rcon.send(command)
      console.log(`[RCON] Ответ от сервера: ${response}`)
    } catch (error) {
      console.error("[RCON] Ошибка при выполнении команды:", error)
      // Перебрасываем ошибку, чтобы Cent.app получил ответ о неудаче
      // и, возможно, попробовал отправить вебхук снова.
      throw error
    } finally {
      // Гарантируем, что соединение будет закрыто в любом случае
      await rcon.end()
      console.log("[RCON] Соединение закрыто.")
    }
    // --- КОНЕЦ РЕАЛЬНОЙ ЛОГИКИ RCON ---

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("Cent.app webhook processing failed:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
