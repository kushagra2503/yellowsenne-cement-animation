"use client"

import { motion } from "framer-motion"

export default function ResultsScene() {
  const results = [
    { label: "Accuracy", value: 96, color: "#f59e0b" },
    { label: "Efficiency", value: 89, color: "#fbbf24" },
    { label: "Reliability", value: 94, color: "#d97706" },
  ]

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-15"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern id="success" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2.5" fill="#f59e0b" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#success)" />
        </svg>
      </motion.div>

      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <motion.h1
          className="text-6xl font-bold text-amber-900 mb-4 text-center tracking-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Proven Results
        </motion.h1>

        <motion.p
          className="text-amber-700 text-xl mb-16 text-center max-w-2xl font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Cross-Process Quality Prediction delivers measurable improvements
        </motion.p>

        {/* Results Grid */}
        <div className="grid grid-cols-3 gap-12 mb-16">
          {results.map((result, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + idx * 0.3, duration: 0.8 }}
            >
              <div className="relative w-40 h-40 mb-8 drop-shadow-lg">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  {/* Background Circle */}
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#fef3c7" strokeWidth="10" />
                  {/* Progress Circle */}
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke={result.color}
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 70 * (1 - result.value / 100),
                    }}
                    transition={{ delay: 1.5 + idx * 0.3, duration: 1.5 }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 + idx * 0.3, duration: 0.6 }}
                  >
                    <div className="text-5xl font-bold text-amber-900">{result.value}%</div>
                  </motion.div>
                </div>
              </div>

              <motion.h3
                className="text-xl font-bold text-amber-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 + idx * 0.3, duration: 0.6 }}
              >
                {result.label}
              </motion.h3>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex gap-6 justify-center flex-wrap max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8 }}
        >
          {["↓ 40% Defects", "↑ 25% Throughput", "↓ 30% Costs", "↑ 99% Uptime"].map((benefit, idx) => (
            <motion.div
              key={idx}
              className="px-8 py-4 bg-white rounded-xl border-2 border-amber-600 text-amber-900 font-bold shadow-lg hover:shadow-xl transition-all text-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.1 + idx * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.08 }}
            >
              {benefit}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
