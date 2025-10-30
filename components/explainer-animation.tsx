"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import FactoryOverview from "./scenes/factory-overview"
import DataFusion from "./scenes/data-fusion"
import SimulationScene from "./scenes/simulation-scene"
import ResultsScene from "./scenes/results-scene"

type SceneType = "factory" | "data" | "simulation" | "results"

export default function ExplainerAnimation() {
  const [currentScene, setCurrentScene] = useState<SceneType>("factory")
  const [isPlaying, setIsPlaying] = useState(true)

  const sceneDurations = {
    factory: 22500,
    data: 22500,
    simulation: 22500,
    results: 22500,
  }

  const sceneSequence: SceneType[] = ["factory", "data", "simulation", "results"]

  useEffect(() => {
    if (!isPlaying) return

    const currentIndex = sceneSequence.indexOf(currentScene)
    const nextIndex = (currentIndex + 1) % sceneSequence.length
    const nextScene = sceneSequence[nextIndex]
    const duration = sceneDurations[currentScene]

    const timer = setTimeout(() => {
      setCurrentScene(nextScene)
    }, duration)

    return () => clearTimeout(timer)
  }, [currentScene, isPlaying])

  const renderScene = () => {
    switch (currentScene) {
      case "factory":
        return <FactoryOverview />
      case "data":
        return <DataFusion />
      case "simulation":
        return <SimulationScene />
      case "results":
        return <ResultsScene />
      default:
        return null
    }
  }

  const goToPreviousScene = () => {
    const currentIndex = sceneSequence.indexOf(currentScene)
    const previousIndex = (currentIndex - 1 + sceneSequence.length) % sceneSequence.length
    setCurrentScene(sceneSequence[previousIndex])
    setIsPlaying(false)
  }

  const goToNextScene = () => {
    const currentIndex = sceneSequence.indexOf(currentScene)
    const nextIndex = (currentIndex + 1) % sceneSequence.length
    setCurrentScene(sceneSequence[nextIndex])
    setIsPlaying(false)
  }

  return (
    <div className="w-full h-full relative">
      <motion.div
        key={currentScene}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full h-full"
      >
        {renderScene()}
      </motion.div>

      <div className="absolute top-8 right-8 flex gap-4 z-50">
        <motion.button
          onClick={goToPreviousScene}
          className="bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white p-3 rounded-full transition-all shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Previous scene"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </motion.button>
        <motion.button
          onClick={goToNextScene}
          className="bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white p-3 rounded-full transition-all shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Next scene"
        >
          <ChevronRight size={24} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  )
}
