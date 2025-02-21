import List from "@/components/List";

export default function Home() {
  return (
    <main className="px-5 pt-5">
      <div>
        <h1 className="font-semibold text-xl">Lista de usuários</h1>
      </div>
      <List/>
    </main>
  );
}
