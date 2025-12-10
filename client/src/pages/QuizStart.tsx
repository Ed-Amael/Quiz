import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'

const QuizStart: React.FC = () => {
  const navigate = useNavigate()

  const startQuiz = () => {
    navigate('/quiz')
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white shadow rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Code Correction Quiz</h2>
        <p className="text-gray-600 mb-8">
          Test your coding skills by fixing broken code snippets. You'll have 10 questions with a 30-second timer for each question.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Instructions</h3>
          <ul className="text-left text-gray-600 space-y-2">
            <li>• There are 10 code correction questions</li>
            <li>• Each question has a 30-second time limit</li>
            <li>• You can navigate between questions using Previous/Next buttons</li>
            <li>• The quiz will automatically advance when time runs out</li>
            <li>• Your answers are saved automatically as you type</li>
            <li>• You can submit the quiz at any time after answering all questions</li>
          </ul>
        </div>

        <button
          onClick={startQuiz}
          className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Play size={20} />
          <span>Start Quiz</span>
        </button>
      </div>
    </div>
  )
}

export default QuizStart