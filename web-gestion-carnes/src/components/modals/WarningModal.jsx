"use client";

import { Box, Typography, Button } from "@mui/material";
import { X } from "lucide-react";
import AlertIcon from "@/components/icons/AlertIcon";
import { useEffect, useState } from "react";

export default function WarningModal({ open, onClose, onConfirmValidOnly, onReview, selectedCarnets = [] }) {
  const [invalidCount, setInvalidCount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const totalSelected = selectedCarnets.length;
    const invalidSelected = selectedCarnets.filter((c) => c.validationState !== "VALIDADO").length;
    setTotal(totalSelected);
    setInvalidCount(invalidSelected);
  }, [selectedCarnets]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-50">
      <Box
        sx={{
          width: 480,
          bgcolor: "white",
          border: "2px solid #0864ec",
          borderRadius: "12px",
          boxShadow: 24,
          px: 4,
          py: 3,
          position: "relative",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AlertIcon />
          <Typography variant="h6" fontWeight={700}>
            AVISO
          </Typography>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </Box>

        {/* Message */}
        <Typography sx={{ mt: 2, fontSize: 16, fontWeight: 500 }}>
          {invalidCount} de {total} carnets de esta selección no son válidos. Si se imprimen, puede que la foto no sea correcta.
        </Typography>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
            gap: 2,
          }}
        >
          <Button
            onClick={onConfirmValidOnly}
            variant="outlined"
            sx={{
              borderColor: "#0864ec",
              color: "#0864ec",
              fontWeight: 700,
              width: "100%",
              "&:hover": {
                backgroundColor: "#e0ebff",
                borderColor: "#0864ec",
              },
            }}
          >
            IMPRIMIR SOLO VALIDOS
          </Button>
          <Button
            onClick={onReview}
            variant="contained"
            sx={{
              backgroundColor: "#0864ec",
              fontWeight: 700,
              width: "100%",
              "&:hover": {
                backgroundColor: "#0654c9",
              },
            }}
          >
            REVISAR CARNETS
          </Button>
        </Box>
      </Box>
    </div>
  );
}