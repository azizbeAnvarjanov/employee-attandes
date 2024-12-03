import Image from "next/image";
import ProtectRoute from "./ProtectRoute";


export default function Home() {
  return (
    <ProtectRoute>
      IMPULS EMPLOEE
    </ProtectRoute>
  );
}
