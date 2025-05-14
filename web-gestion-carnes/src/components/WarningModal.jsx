"use client";
import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

export default function WarningModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Advertencia
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Algunos carnets seleccionados no están validados. Por favor, revisa su estado antes de imprimir.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onClose} color="secondary">Cancelar</Button>
          <Button onClick={onConfirm} color="primary" variant="contained">Ver carnet</Button>
        </Box>
      </Box>
    </Modal>
  );
}
