"use server"

import crypto from "crypto"
import { kv } from '@vercel/kv'
import { Rcon } from "rcon-client"

// Функция для получения цены привилегии
function getRankPrice(rank: string): number {
  const prices: { [key: string]: number } = {
    Рыцарь: 27,
    Хранитель: 39,
    Маг: 79,
    Искатель: 129,
    Вельможа: 249,
    Император: 349,
    Феникс: 549,
    Творец: 879,
    Владыка: 1299,
  }
  return prices[rank] || 0
}

// --- RCON И ПРОВЕРКА ИГРОКА ---

async function executeRconCommand(command: string): Promise<string> {
  const { RCON_HOST, RCON_PORT, RCON_PASSWORD } = process.env
  if (!RCON_HOST || !RCON_PORT || !RCON_PASSWORD) {
    throw new Error("Server RCON configuration is incomplete.")
  }
  const rcon = new Rcon({ host: RCON_HOST, port: Number.parseInt(RCON_PORT), password: RCON_PASSWORD })
  try {
    await rcon.connect()
    const response = await rcon.send(command)
    return response
  } finally {
    await rcon.end()
  }
}

async function checkPlayerExists(nickname: string): Promise<boolean> {
  try {
    const response = await executeRconCommand(`lp user ${nickname} info`)
    return !response.includes("does not have any data")
  } catch (error) {
    console.log(`Player check for ${nickname} failed, assuming non-existent. Error:`, error)
    return false
  }
}

// --- АДМИН ПАНЕЛЬ ---

export async function verifyAdminPassword(password: string) {
  if (password === "MountainInZeta3am") {
    return { success: true }
  }
  return { success: false }
}

export async function getTestModeStatus(): Promise<boolean> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.warn("Vercel KV не настроен. Тестовый режим по умолчанию выключен.")
    return false
  }
  return (await kv.get("test_mode_enabled")) || false
}

export async function setTestModeStatus(enabled: boolean) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error("Vercel KV не настроен. Невозможно изменить статус тестового режима.")
    throw new Error("Vercel KV не настроен на сервере.")
  }
  await kv.set("test_mode_enabled", enabled)
}

// --- ЛОГИКА ПОКУПОК ---

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

async function createCentPayment(amount: number, orderId: string, comment: string, customFields: object) {
  const shopId = process.env.CENT_SHOP_ID
  const secretKey = process.env.CENT_SECRET_KEY
  const apiKey = process.env.CENT_API_KEY

  if (!shopId || !secretKey || !apiKey) {
    throw new Error("Данные для подключения к Cent.app не настроены на сервере.")
  }

  const data = {
    amount: amount,
    shop_id: Number.parseInt(shopId),
    order_id: orderId,
    custom_fields: JSON.stringify(customFields),
    comment: comment,
  }

  const sortedKeys = Object.keys(data).sort()
  const signString = sortedKeys.map((key) => data[key]).join(":") + `:${secretKey}`
  const signature = crypto.createHash("sha256").update(signString).digest("hex")

  try {
    const response = await fetch("https://cent.app/api/v2/bill/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ ...data, signature }),
    })
    const responseData = await response.json()

    if (responseData.status === "success" && responseData.data.redirect_url) {
      return { success: true, paymentUrl: responseData.data.redirect_url }
    } else {
      console.error("Cent.app API error:", responseData.message)
      throw new Error(responseData.message || "Ошибка при создании счета в Cent.app.")
    }
  } catch (error) {
    console.error("Failed to connect to Cent.app API:", error)
    throw new Error("Не удалось связаться с платежной системой.")
  }
}

async function processPurchase(
  nickname: string,
  amount: number,
  orderId: string,
  comment: string,
  customFields: object,
  rconCommand: string,
) {
  const playerExists = await checkPlayerExists(nickname)
  if (!playerExists) {
    throw new Error("Игрока с таким ником не существует или он никогда не заходил на сервер.")
  }

  const isTestMode = await getTestModeStatus()
  if (isTestMode) {
    console.log(`[ТЕСТОВЫЙ РЕЖИМ] Выдача товара для ${nickname} без оплаты.`)
    await executeRconCommand(rconCommand)
    return { success: true, testMode: true }
  }

  return createCentPayment(amount, orderId, comment, customFields)
}

export async function handlePurchase(nickname: string, rank: string) {
  const amount = getRankPrice(rank)
  const orderId = `ZMC-RANK-${Date.now()}`
  const comment = `Покупка привилегии ${rank} для ${nickname}`
  const customFields = { type: "privilege", nickname, rank }
  const commandRank = rankCommandMap[rank]
  const rconCommand = `lp user ${nickname} parent addtemp ${commandRank} 1m`

  return processPurchase(nickname, amount, orderId, comment, customFields, rconCommand)
}

export async function handleZephyrPurchase(nickname: string, quantity: number) {
  const amount = quantity * 0.5
  const orderId = `ZMC-ZEPHYR-${Date.now()}`
  const comment = `Покупка ${quantity} зефиров для ${nickname}`
  const customFields = { type: "zephyr", nickname, quantity }
  const rconCommand = `p give ${nickname} ${quantity}`

  return processPurchase(nickname, amount, orderId, comment, customFields, rconCommand)
}
