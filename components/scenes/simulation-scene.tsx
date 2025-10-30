"use client"

import { motion } from "framer-motion"

export default function SimulationScene() {
  const simulationPoints = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 60 + 20,
  }))

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <radialGradient id="pulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="30%" fill="url(#pulse)" />
        </svg>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          className="relative w-80 h-80 rounded-full border-3 border-amber-600 bg-gradient-to-br from-white to-amber-50 shadow-2xl flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-amber-300"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-amber-200"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />

          <div className="text-center z-10">
            <motion.h2
              className="text-4xl font-bold text-amber-900 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Synergy Engine
            </motion.h2>
            <motion.p
              className="text-amber-700 text-base font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
            >
              Cross-Department Prediction
            </motion.p>
          </div>
        </motion.div>

        {/* Orbiting Data Points - Department Collaboration */}
        {simulationPoints.map((point) => (
          <motion.div
            key={point.id}
            className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 shadow-lg"
            initial={{
              x: Math.cos((point.id / 20) * Math.PI * 2) * 200,
              y: Math.sin((point.id / 20) * Math.PI * 2) * 200,
              opacity: 0,
            }}
            animate={{
              x: Math.cos((point.id / 20) * Math.PI * 2 + Math.PI * 2) * 200,
              y: Math.sin((point.id / 20) * Math.PI * 2 + Math.PI * 2) * 200,
              opacity: [0, 1, 0],
            }}
            transition={{
              delay: point.id * 0.1,
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
            }}
          />
        ))}

        <motion.div
          className="absolute top-20 right-20 space-y-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {[
            { label: "Quarry ↔ Lab", icon: "🔄" },
            { label: "Lab ↔ Kiln", icon: "🔄" },
            { label: "Kiln ↔ Mill", icon: "🔄" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-3 bg-white/80 backdrop-blur px-4 py-2 rounded-lg shadow-md border border-amber-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 + idx * 0.3, duration: 0.6 }}
            >
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-amber-600"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: idx * 0.2 }}
              />
              <span className="text-amber-900 font-semibold text-sm">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-20 space-y-3"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <h3 className="text-amber-900 font-bold text-base">Synergy Steps</h3>
          <div className="flex gap-2">
            {[
              { label: "Collect", desc: "All Data" },
              { label: "Fuse", desc: "Unified" },
              { label: "Analyze", desc: "Patterns" },
              { label: "Predict", desc: "Quality" },
              { label: "Optimize", desc: "Process" },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="w-14 h-14 rounded-lg border-2 border-amber-600 flex flex-col items-center justify-center text-xs font-bold text-amber-900 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2 + i * 0.15, duration: 0.5 }}
              >
                <div>{step.label}</div>
                <div className="text-xs font-normal text-amber-700">{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute top-12 left-12 text-amber-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold tracking-tight">Synergy in Action</h1>
        <p className="text-amber-700 mt-3 text-lg font-medium">Real-time Cross-Department Collaboration</p>
      </motion.div>

      <motion.div
        className="absolute bottom-12 right-12 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6 max-w-sm shadow-xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
      >
        <p className="text-blue-900 font-bold text-base">🔗 Departments Working Together</p>
        <p className="text-blue-700 text-sm mt-3 leading-relaxed">
          Quarry insights inform Lab decisions. Lab data guides Kiln operations. Real-time synergy prevents quality
          issues.
        </p>
      </motion.div>
    </div>
  )
}
