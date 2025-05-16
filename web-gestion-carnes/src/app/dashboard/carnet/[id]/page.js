"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/header";
import {
  getCardPreview,
  getFilteredMembers,
  editMemberValidatioStatus,
} from "@/services/member";
import { Send } from "@deemlol/next-icons";
import CarnetTable2 from "@/components/CarnetTable2";
import CarnetRejectModal from "@/components/RejectedModal";
import AcceptedModal from "@/components/AcceptedModal";

export default function CarnetPage() {
  const { id } = useParams();
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentData = JSON.parse(localStorage.getItem("currentCarnet"));

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const previewData = await getCardPreview(id);
        const fullImageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${previewData.preview}`;
        setImageSrc(fullImageUrl);

        const res = await getFilteredMembers({ _id: id });
        if (res.length > 0) {
          setMemberData(res[0]);
          setSelectedStatus(res[0].validationState);
        } else {
          throw new Error("Carnet no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener el carnet:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router, refreshKey]);

  const updateLocalStorageStatus = (newStatus) => {
    const displayStatus = newStatus === "validated" ? "VALIDADO" : "NO VÁLIDO";
    const updatedCurrent = { ...currentData, validationState: displayStatus };
    localStorage.setItem("currentCarnet", JSON.stringify(updatedCurrent));

    const stored = localStorage.getItem("selectedCarnets");
    const parsed = stored ? JSON.parse(stored) : [];
    const updated = parsed.map((m) =>
      m.id === updatedCurrent.id ? { ...m, validationState: displayStatus } : m
    );
    localStorage.setItem("selectedCarnets", JSON.stringify(updated));
    setRefreshKey((prev) => prev + 1);
  };

  const handleRejectSubmit = async (reason) => {
    try {
      await editMemberValidatioStatus(currentData.id, "rejected");
      setMemberData((prev) => ({ ...prev, validationState: "rejected" }));
      updateLocalStorageStatus("rejected");
      alert("Notificación enviada por correo");
      setShowRejectModal(false);
    } catch (error) {
      console.error("Error al rechazar carnet:", error);
    }
  };

  const handleAcceptConfirm = async () => {
    try {
      await editMemberValidatioStatus(currentData.id, "validated");
      setMemberData((prev) => ({ ...prev, validationState: "validated" }));
      updateLocalStorageStatus("validated");
      alert("Notificación enviada por correo");
      setShowAcceptModal(false);
    } catch (error) {
      console.error("Error al validar carnet:", error);
    }
  };

  const handleNotify = () => {
    if (selectedStatus === "validated") {
      setShowAcceptModal(true);
    } else if (selectedStatus === "rejected") {
      setShowRejectModal(true);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando carnet...</p>;
  if (!imageSrc || !memberData) return <p>Error cargando el carnet</p>;

  return (
    <>
      <Header selectedIds={[]} hideSearch hideUser showCancelbutton />

      <div className="min-h-screen bg-gray-100 pt-20 px-6 flex flex-col items-start">
        <div className="w-full flex flex-row gap-8 items-start">
          <div className="ml-[-32px]">
            <CarnetTable2 key={refreshKey} />
          </div>

          <div className="w-[1136px] h-[575px] rounded-[12px] p-6 flex flex-col justify-between">
            <div className="flex flex-col items-start gap-6">
              <Image
                src={imageSrc}
                alt="Carnet de usuario"
                width={400}
                height={0}
                layout="intrinsic"
                className="rounded-lg w-full"
              />
            </div>

            <div className="flex items-center gap-6 mt-6">
              <p className="text-lg font-bold text-black uppercase whitespace-nowrap">ESTADO DEL CARNET:</p>

              {["rejected", "validated"].map((state) => (
                <div
                  key={state}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setSelectedStatus(state)}
                >
                  <div className="w-5 h-5 border-2 rounded-full flex items-center justify-center border-[#0065EF]">
                    {selectedStatus === state && (
                      <div className="w-3 h-3 rounded-full bg-[#0065EF]" />
                    )}
                  </div>
                  <span className="text-lg font-bold text-black">
                    {state === "rejected" ? "NO VÁLIDO" : "PARA IMPRIMIR"}
                  </span>
                </div>
              ))}
            </div>

            <button
              className="mt-4 flex items-center justify-center gap-3 w-[366px] h-[60px] bg-[#0065EF] text-white rounded-[4px] px-4 py-3 text-xl font-normal hover:opacity-90"
              onClick={handleNotify}
            >
              NOTIFICAR POR CORREO
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showRejectModal && (
        <CarnetRejectModal
          onClose={() => setShowRejectModal(false)}
          onSend={handleRejectSubmit}
        />
      )}

      {showAcceptModal && (
        <AcceptedModal
          onClose={() => setShowAcceptModal(false)}
          onConfirm={handleAcceptConfirm}
        />
      )}
    </>
  );
}