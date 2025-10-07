import Image from "next/image";
import TreasureCard from "./components/TreasureCard";


export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <header className="flex flex-col items-center">
        <Image
        src='/images/logo.png'
        alt="Treasure Log logo"

        height={200}
        width={200}
        className=""
      />
        <h1 className="
          text-5xl font-family-title text-brand-deep 
          text-center pb-7 tracking-wider -mt-10
        "
        >
          Treasure Log
        </h1></header>


      <TreasureCard />
    </main>
  );
}