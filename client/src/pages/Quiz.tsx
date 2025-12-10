import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizService } from '../services/quizService'
import { Question, Answer } from '../types'
import { ChevronLeft, ChevronRight, Clock, Save } from 'lucide-react'

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [isSaving, setIsSaving] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const navigate = useNavigate()

  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    const loadQuestions = async () => {
      const loadedQuestions = await quizService.getQuestions()
      setQuestions(loadedQuestions)
      setAnswers(loadedQuestions.map(q => ({ questionId: q.id, answer: '' })))
      setTimeLeft(loadedQuestions[0]?.timeLimit || 30)
    }
    loadQuestions()
  }, [])

  useEffect(() => {
    if (questions.length === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAutoAdvance()
          return questions[currentQuestionIndex]?.timeLimit || 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex, questions])

  const handleAutoAdvance = useCallback(() => {
    saveCurrentAnswer()
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setTimeLeft(questions[currentQuestionIndex + 1]?.timeLimit || 30)
    } else {
      handleSubmitQuiz()
    }
  }, [currentQuestionIndex, questions])

  const saveCurrentAnswer = useCallback(async () => {
    if (!currentQuestion) return

    setIsSaving(true)
    try {
      const currentAnswer = answers.find(a => a.questionId === currentQuestion.id)
      if (currentAnswer) {
        await quizService.submitAnswers([currentAnswer])
      }
    } catch (error) {
      console.error('Failed to save answer:', error)
    } finally {
      setIsSaving(false)
    }
  }, [currentQuestion, answers])

  const handleAnswerChange = (value: string) => {
    const newAnswers = answers.map(answer =>
      answer.questionId === currentQuestion?.id
        ? { ...answer, answer: value }
        : answer
    )
    setAnswers(newAnswers)
    
    // Auto-save after typing stops (debounced)
    const timeoutId = setTimeout(() => {
      saveCurrentAnswer()
    }, 1000)
    
    return () => clearTimeout(timeoutId)
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      saveCurrentAnswer()
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setTimeLeft(questions[currentQuestionIndex - 1]?.timeLimit || 30)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      saveCurrentAnswer()
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setTimeLeft(questions[currentQuestionIndex + 1]?.timeLimit || 30)
    }
  }

  const handleSubmitQuiz = async () => {
    try {
      const result = await quizService.submitQuiz(answers)
      navigate('/results', { state: { result } })
    } catch (error) {
      console.error('Failed to submit quiz:', error)
    }
  }

  const allQuestionsAnswered = answers.every(answer => answer.answer.trim() !== '')

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-gray-500" />
              <span className={`text-sm font-medium ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-700'}`}>
                {timeLeft}s
              </span>
              {isSaving && (
                <div className="flex items-center space-x-1 text-green-600">
                  <Save size={14} />
                  <span className="text-xs">Saved</span>
                </div>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentQuestion.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {currentQuestion.description}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              <code>{currentQuestion.brokenCode}</code>
            </pre>
          </div>
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
            Your corrected code:
          </label>
          <textarea
            id="answer"
            value={answers.find(a => a.questionId === currentQuestion.id)?.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            placeholder="Enter your corrected code here..."
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={() => setShowSubmitConfirm(true)}
              disabled={!allQuestionsAnswered}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Quiz?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your quiz? You won't be able to make any changes after submission.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Quiz