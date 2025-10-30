"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function FactoryOverview() {
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 0, scale: 1 })

  useEffect(() => {
    const timeline = [
      { x: 0, y: 0, scale: 0.8, duration: 0 },
      { x: -200, y: -100, scale: 1.2, duration: 4000 },
      { x: -100, y: 50, scale: 1, duration: 8000 },
      { x: 100, y: -50, scale: 1.1, duration: 12000 },
      { x: 0, y: 0, scale: 0.9, duration: 16000 },
    ]

    timeline.forEach((frame, index) => {
      setTimeout(() => {
        setCameraPos({ x: frame.x, y: frame.y, scale: frame.scale })
      }, frame.duration)
    })
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-200 via-yellow-50 to-amber-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300/50 to-transparent opacity-60" />

      {/* Factory Scene */}
      <motion.div
        animate={{
          x: cameraPos.x,
          y: cameraPos.y,
          scale: cameraPos.scale,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <svg viewBox="0 0 1200 600" className="w-full h-full max-w-6xl" preserveAspectRatio="xMidYMid slice">
          {/* Quarry - SILOED */}
          <g>
            <motion.rect
              x="50"
              y="350"
              width="150"
              height="200"
              fill="none"
              stroke="#b45309"
              strokeWidth="2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            />
            <motion.rect
              x="50"
              y="350"
              width="150"
              height="200"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="8,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            />
            <motion.text
              x="125"
              y="480"
              textAnchor="middle"
              className="text-sm font-bold fill-amber-900"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Quarry
            </motion.text>
            <motion.circle
              cx="125"
              cy="320"
              r="10"
              fill="#fbbf24"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            />
            <motion.text
              x="125"
              y="305"
              textAnchor="middle"
              className="text-xs fill-amber-900 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              Raw Mix
            </motion.text>
            <motion.text
              x="125"
              y="515"
              textAnchor="middle"
              className="text-xs fill-red-600 font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              Isolated Data
            </motion.text>
          </g>

          {/* Raw Mix Lab - SILOED */}
          <g>
            <motion.rect
              x="300"
              y="350"
              width="150"
              height="200"
              fill="none"
              stroke="#b45309"
              strokeWidth="2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            />
            <motion.rect
              x="300"
              y="350"
              width="150"
              height="200"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="8,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.8 }}
            />
            <motion.text
              x="375"
              y="480"
              textAnchor="middle"
              className="text-sm font-bold fill-amber-900"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.8 }}
            >
              Raw Mix Lab
            </motion.text>
            <motion.circle
              cx="375"
              cy="320"
              r="10"
              fill="#fbbf24"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.7, duration: 0.6 }}
            />
            <motion.text
              x="375"
              y="305"
              textAnchor="middle"
              className="text-xs fill-amber-900 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.6 }}
            >
              Analysis
            </motion.text>
            <motion.text
              x="375"
              y="515"
              textAnchor="middle"
              className="text-xs fill-red-600 font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 0.6 }}
            >
              Isolated Data
            </motion.text>
          </g>

          {/* Kiln - SILOED */}
          <g>
            <motion.ellipse
              cx="550"
              cy="420"
              rx="60"
              ry="100"
              fill="none"
              stroke="#b45309"
              strokeWidth="2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5, duration: 1 }}
            />
            <motion.ellipse
              cx="550"
              cy="420"
              rx="60"
              ry="100"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="8,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.7, duration: 0.8 }}
            />
            <motion.text
              x="550"
              y="480"
              textAnchor="middle"
              className="text-sm font-bold fill-amber-900"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4, duration: 0.8 }}
            >
              Kiln
            </motion.text>
            <motion.circle
              cx="550"
              cy="280"
              r="10"
              fill="#fbbf24"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 4.2, duration: 0.6 }}
            />
            <motion.text
              x="550"
              y="265"
              textAnchor="middle"
              className="text-xs fill-amber-900 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.3, duration: 0.6 }}
            >
              Heating
            </motion.text>
            <motion.text
              x="550"
              y="545"
              textAnchor="middle"
              className="text-xs fill-red-600 font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.5, duration: 0.6 }}
            >
              Isolated Data
            </motion.text>
          </g>

          {/* Grinding Mill - SILOED */}
          <g>
            <motion.circle
              cx="800"
              cy="420"
              r="80"
              fill="none"
              stroke="#b45309"
              strokeWidth="2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5, duration: 1 }}
            />
            <motion.circle
              cx="800"
              cy="420"
              r="80"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="8,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5.2, duration: 0.8 }}
            />
            <motion.text
              x="800"
              y="480"
              textAnchor="middle"
              className="text-sm font-bold fill-amber-900"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 5.5, duration: 0.8 }}
            >
              Grinding Mill
            </motion.text>
            <motion.circle
              cx="800"
              cy="280"
              r="10"
              fill="#fbbf24"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 5.7, duration: 0.6 }}
            />
            <motion.text
              x="800"
              y="265"
              textAnchor="middle"
              className="text-xs fill-amber-900 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5.8, duration: 0.6 }}
            >
              Grinding
            </motion.text>
            <motion.text
              x="800"
              y="545"
              textAnchor="middle"
              className="text-xs fill-red-600 font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 6, duration: 0.6 }}
            >
              Isolated Data
            </motion.text>
          </g>

          {/* Quality Lab - SILOED */}
          <g>
            <motion.rect
              x="1000"
              y="350"
              width="150"
              height="200"
              fill="none"
              stroke="#b45309"
              strokeWidth="2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 6.5, duration: 1 }}
            />
            <motion.rect
              x="1000"
              y="350"
              width="150"
              height="200"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="8,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 6.7, duration: 0.8 }}
            />
            <motion.text
              x="1075"
              y="480"
              textAnchor="middle"
              className="text-sm font-bold fill-amber-900"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 7, duration: 0.8 }}
            >
              Quality Lab
            </motion.text>
            <motion.circle
              cx="1075"
              cy="320"
              r="10"
              fill="#fbbf24"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 7.2, duration: 0.6 }}
            />
            <motion.text
              x="1075"
              y="305"
              textAnchor="middle"
              className="text-xs fill-amber-900 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 7.3, duration: 0.6 }}
            >
              Testing
            </motion.text>
            <motion.text
              x="1075"
              y="515"
              textAnchor="middle"
              className="text-xs fill-red-600 font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 7.5, duration: 0.6 }}
            >
              Isolated Data
            </motion.text>
          </g>

          {/* Connection Lines - BROKEN (showing silos) */}
          <motion.line
            x1="200"
            y1="420"
            x2="300"
            y2="420"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="6,4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ delay: 1.8, duration: 1 }}
          />
          <motion.line
            x1="450"
            y1="420"
            x2="490"
            y2="420"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="6,4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ delay: 3.3, duration: 1 }}
          />
          <motion.line
            x1="610"
            y1="420"
            x2="720"
            y2="420"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="6,4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ delay: 4.8, duration: 1 }}
          />
          <motion.line
            x1="880"
            y1="420"
            x2="1000"
            y2="420"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="6,4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ delay: 6.3, duration: 1 }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-12 left-12 text-amber-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold tracking-tight">The Problem: Siloed Data</h1>
        <p className="text-amber-700 mt-3 text-lg font-medium">
          Each department operates independently with isolated data
        </p>
      </motion.div>

      <motion.div
        className="absolute bottom-12 right-12 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-6 max-w-sm shadow-xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 8, duration: 0.8 }}
      >
        <p className="text-red-900 font-bold text-base">❌ No Cross-Department Visibility</p>
        <p className="text-red-700 text-sm mt-3 leading-relaxed">
          Quality issues discovered too late. Departments can't collaborate on predictions.
        </p>
      </motion.div>
    </div>
  )
}
