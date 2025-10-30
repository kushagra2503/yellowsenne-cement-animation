"use client"

import { motion } from "framer-motion"

export default function DataFusion() {
  const dataStreams = [
    { id: 1, color: "#fbbf24", label: "Quarry Data", delay: 0.5, dept: "Quarry" },
    { id: 2, color: "#f59e0b", label: "Lab Data", delay: 1, dept: "Raw Mix Lab" },
    { id: 3, color: "#d97706", label: "Kiln Data", delay: 1.5, dept: "Kiln" },
    { id: 4, color: "#b45309", label: "Mill Data", delay: 2, dept: "Grinding Mill" },
  ]

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#b45309" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        {/* Data Streams Coming In - From Different Departments */}
        <div className="absolute left-12 top-1/2 transform -translate-y-1/2 space-y-8">
          {dataStreams.map((stream) => (
            <motion.div
              key={stream.id}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: stream.delay, duration: 0.8 }}
            >
              <motion.div
                className="w-14 h-14 rounded-xl border-2 flex items-center justify-center shadow-lg"
                style={{ borderColor: stream.color, backgroundColor: stream.color + "25" }}
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ delay: stream.delay + 0.5, duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stream.color }} />
              </motion.div>
              <div>
                <span className="text-amber-900 font-bold block text-sm">{stream.label}</span>
                <span className="text-amber-600 text-xs font-medium">{stream.dept}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative w-96 h-96 rounded-2xl border-2 border-amber-600 bg-gradient-to-br from-white to-amber-50 shadow-2xl p-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.h2
            className="text-3xl font-bold text-amber-900 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            Breaking Silos
          </motion.h2>
          <motion.p
            className="text-amber-700 text-sm mb-6 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.8 }}
          >
            Unified Data Fusion
          </motion.p>

          {/* Process Sliders */}
          <div className="space-y-4 mb-6">
            {[
              { label: "Quarry", value: 75 },
              { label: "Lab", value: 85 },
              { label: "Kiln", value: 60 },
            ].map((slider, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 + idx * 0.3, duration: 0.6 }}
              >
                <div className="flex justify-between text-xs text-amber-700 mb-2 font-semibold">
                  <span>{slider.label}</span>
                  <span>{slider.value}%</span>
                </div>
                <motion.div
                  className="h-2.5 bg-amber-100 rounded-full overflow-hidden shadow-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 + idx * 0.3, duration: 0.6 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${slider.value}%` }}
                    transition={{ delay: 2.4 + idx * 0.3, duration: 1 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="grid grid-cols-3 gap-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.8 }}
          >
            {[
              { label: "MAE", value: "0.12" },
              { label: "MSE", value: "0.08" },
              { label: "R²", value: "0.96" },
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-3 border border-amber-200 shadow-md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.7 + idx * 0.2, duration: 0.6 }}
              >
                <div className="text-xs text-amber-600 font-bold">{metric.label}</div>
                <div className="text-xl font-bold text-amber-900">{metric.value}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Data Streams Flowing In */}
        {dataStreams.map((stream) => (
          <motion.div
            key={`flow-${stream.id}`}
            className="absolute left-32 top-1/2 transform -translate-y-1/2 w-64 h-1.5 rounded-full shadow-lg"
            style={{
              background: `linear-gradient(90deg, ${stream.color}, transparent)`,
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 0] }}
            transition={{
              delay: stream.delay + 0.8,
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute top-12 left-12 text-amber-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold tracking-tight">The Solution: Data Fusion</h1>
        <p className="text-amber-700 mt-3 text-lg font-medium">Unified data from all departments in real-time</p>
      </motion.div>

      <motion.div
        className="absolute bottom-12 right-12 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 max-w-sm shadow-xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4, duration: 0.8 }}
      >
        <p className="text-green-900 font-bold text-base">✓ Cross-Department Visibility</p>
        <p className="text-green-700 text-sm mt-3 leading-relaxed">
          All departments see the same data. Enables real-time collaboration and early issue detection.
        </p>
      </motion.div>
    </div>
  )
}
