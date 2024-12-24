// import Image from "next/image";
import Link from "next/link";
import RegisterServiceWorker from "./RegisterserviceWorker";

export default function Home() {
  return (
    <main className=" w-full h-screen flex-col flex justify-center items-center">
      <RegisterServiceWorker />
      <h1 className="text-center font-bold mb-40 text-[#010101] md:text-8xl text-4xl">Shalom Project</h1>

      <div className="w-full flex justify-center items-center gap-x-8 px-5">
        <Link className="px-4 py-2 text-[0.9rem] text-center md:text-[1rem] rounded-full bg-[#0099ff] text-white" href="/student">Onboard as a Student</Link>
        <Link className="px-4 py-2 text-[0.9rem] text-center md:text-[1rem] rounded-full bg-[#0099ff] text-white" href="/staff"> Onboard as a Staff</Link>
        {/* <Link></Link> for admin */}

      </div>
      
    </main>
  );
}
