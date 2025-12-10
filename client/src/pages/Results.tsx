import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { quizService } from '../services/quizService'
import { useAuth } from '../contexts/AuthContext'
import { QuizResult } from '../types'
import { Download, ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react'

const Results: React.FC = () => {
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (location.state?.result) {
      setResult(location.state.result)
    }
  }, [location.state])

  const handleExport = async () => {
    if (!user?.isAdmin) return

    setLoading(true)
    try {
      const blob = await quizService.exportSubmissions()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quiz-submissions-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to export submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRetakeQuiz = () => {
    navigate('/quiz-start')
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const correctCount = result.questionResults.filter(qr => qr.isCorrect).length
  const totalCount = result.questionResults.length
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/quiz-start')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            <span>Back to Quiz Start</span>
          </button>
          {user?.isAdmin && (
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Download size={16} />
              <span>{loading ? 'Exporting...' : 'Export All'}</span>
            </button>
          )}
        </div>

        {/* Score Summary */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{correctCount}/{totalCount}</div>
              <div className="text-sm opacity-90">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{percentage}%</div>
              <div className="text-sm opacity-90">Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {result.submission.totalScore !== null ? result.submission.totalScore : 'N/A'}
              </div>
              <div className="text-sm opacity-90">Total Score</div>
            </div>
          </div>
        </div>

        {/* Question Results */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Breakdown</h3>
          {result.questionResults.map((qr, index) => (
            <div key={qr.questionId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">
                    Question {index + 1}
                  </span>
                  {qr.isCorrect === true && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                  {qr.isCorrect === false && (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  {qr.isCorrect === null && (
                    <Clock size={16} className="text-yellow-500" />
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {qr.score !== null ? `Score: ${qr.score}` : 'Pending Review'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Your Answer
                  </label>
                  <pre className="mt-1 p-2 bg-gray-50 rounded text-sm text-gray-800 whitespace-pre-wrap">
                    <code>{qr.answer || 'No answer provided'}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleRetakeQuiz}
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  )
}

export default Results