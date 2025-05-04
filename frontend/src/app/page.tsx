import GuestbookInput from "@/lib/components/ui/GuestbookInput";
import GuestbookList from "@/lib/components/ui/GuestbookList";
import Header from "@/lib/components/ui/Header";

export default function Home() {

  return (
    <main className="mx-auto max-w-[1200px] px-4 pt-10 tb:px-6">
      <Header />
      <h1 className="text-title1 mb:text-title2 text-center font-bold">방명록</h1>
      <GuestbookInput />
      <GuestbookList />
    </main>
  );
}