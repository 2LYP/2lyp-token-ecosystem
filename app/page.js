
import Image from "next/image";
import OverviewPage from "./overview/page";
import Navbar from "./navbar/page";
import Footer from "./footer/page";


export default function Home() {
  return (
    <>
      <OverviewPage />
      <Footer />
    </>
  );
}
