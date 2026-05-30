import Image from "next/image";
import LandingImage from "../assets/pexels-dibakar-roy-2432543-13170432.jpg";
export default function LandingPage() {
  return (
    <>
      <div className="relative w-full h-[650px]  overflow-hidden shadow-lg">
      <Image
        src={LandingImage}
        alt="Hero"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Rescue. Heal. Rehome.
        </h1>
        <p className="text-lg md:text-xl max-w-xl">
          Be the reason a stray finds hope today.
        </p>
      </div>
    </div>
    </>
  );
}
