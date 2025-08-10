import { Header } from "@/components/header"
import { PrivilegesGrid } from "@/components/privileges-grid"
import { Footer } from "@/components/footer"
import { ZephyrPurchase } from "@/components/zephyr-purchase"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      <Header />
      <main className="flex-grow">
        <section className="relative pt-16 md:pt-24 pb-20 md:pb-32 overflow-hidden">
          {/* Фоновое изображение */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: "url('/minecraft-hero.png')" }}
          />
          {/* Градиентная маска со всех сторон */}
          <div className="absolute inset-0 bg-gradient-to-t from-background" />
          <div className="absolute inset-0 bg-gradient-to-b from-background" />
          <div className="absolute inset-0 bg-gradient-to-l from-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background" />

          <div className="container relative mx-auto px-4 text-center pt-12">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              Магазин привилегий ZetaMC
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              Приобретайте уникальные возможности и поддержите развитие нашего сервера. Выдача привилегий происходит
              автоматически после оплаты.
            </p>
          </div>
        </section>

        <section id="shop" className="py-16 md:py-24 bg-background -mt-24">
          <div className="container mx-auto px-4 space-y-20">
            <ZephyrPurchase />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Выберите свою привилегию</h2>
              <PrivilegesGrid />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
