"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CopyIpProps {
  ip: string
}

export function CopyIp({ ip }: CopyIpProps) {
  const [hasCopied, setHasCopied] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ip)
    toast({
      title: "Скопировано!",
      description: `IP адрес ${ip} скопирован в буфер обмена.`,
    })
    setHasCopied(true)
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <button
      onClick={copyToClipboard}
      className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-800/50 px-3 py-2 text-center transition-colors hover:bg-gray-700/50 border border-border"
    >
      <p className="font-mono text-sm font-bold text-primary">{ip}</p>
      <span className="text-gray-400">
        {hasCopied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
      </span>
    </button>
  )
}
