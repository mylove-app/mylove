"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

export default function ConfirmationModal({
  open,
  onClose,
  mode = "success", // success | error | warning | loading
  title,
  description,
  onConfirm,
  confirmText = "OK",
  cancelText = "Batal",
  showCancel = true,
}) {
  const getIcon = () => {
    switch (mode) {
      case "success":
        return <CheckCircle className="w-14 h-14 text-green-500" />;
      case "error":
        return <XCircle className="w-14 h-14 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-14 h-14 text-yellow-500" />;
      case "loading":
        return <Loader2 className="w-14 h-14 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative">
              <div className="flex justify-center mb-3">{getIcon()}</div>

              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                {description}
              </p>

              {mode !== "loading" && (
                <div className="flex justify-center gap-3 mt-6">
                  {showCancel && (
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                    >
                      {cancelText}
                    </button>
                  )}
                  <button
                    onClick={onConfirm}
                    className={`px-4 py-2 rounded-lg text-white transition ${
                      mode === "error"
                        ? "bg-red-500 hover:bg-red-600"
                        : mode === "warning"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {confirmText}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
