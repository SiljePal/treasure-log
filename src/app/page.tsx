import TreasureCard from "./components/TreasureCard";


export default function Home() {
  return (
    <main className="min-h-screen p-4">
      {/* Apply the custom font-title utility and your brand colors 
        text-brand-deep: #462211
      */}
      <h1 className="
          text-5xl font-family-title text-brand-deep 
          text-center py-8 tracking-wider
        "
      >
        Treasure Log
      </h1>

      <TreasureCard />
    </main>
  );
}