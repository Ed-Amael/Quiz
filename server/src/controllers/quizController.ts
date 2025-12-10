import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { gradeAnswer } from '../utils/grader'
import { SubmitAnswersData, QuizResult } from '../types'

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        brokenCode: true,
        expectedAnswer: true,
        timeLimit: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    res.json(questions)
  } catch (error) {
    console.error('Get questions error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const submitAnswers = async (req: Request, res: Response) => {
  try {
    const { answers }: SubmitAnswersData = req.body
    const userId = req.user!.id

    // Find or create a submission for this user
    let submission = await prisma.submission.findFirst({
      where: {
        userId,
        submittedAt: null, // Only find incomplete submissions
      },
      include: {
        answers: true,
      },
    })

    if (!submission) {
      // Create new submission
      submission = await prisma.submission.create({
        data: {
          userId,
        },
        include: {
          answers: true,
        },
      })
    }

    // Update or create answers
    for (const answerData of answers) {
      const existingAnswer = submission.answers.find(
        (a) => a.questionId === answerData.questionId
      )

      if (existingAnswer) {
        // Update existing answer
        await prisma.answer.update({
          where: { id: existingAnswer.id },
          data: {
            answer: answerData.answer,
          },
        })
      } else {
        // Create new answer
        await prisma.answer.create({
          data: {
            answer: answerData.answer,
            questionId: answerData.questionId,
            submissionId: submission.id,
          },
        })
      }
    }

    res.json({ message: 'Answers saved successfully' })
  } catch (error) {
    console.error('Submit answers error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const { answers }: SubmitAnswersData = req.body
    const userId = req.user!.id

    // Find the incomplete submission
    const submission = await prisma.submission.findFirst({
      where: {
        userId,
        submittedAt: null,
      },
      include: {
        answers: true,
      },
    })

    if (!submission) {
      return res.status(404).json({ error: 'No active quiz found' })
    }

    // Grade all answers
    let totalScore = 0
    const questionResults = []

    for (const answerData of answers) {
      const question = await prisma.question.findUnique({
        where: { id: answerData.questionId },
      })

      if (!question) {
        continue
      }

      const gradingResult = gradeAnswer(answerData.answer, question.expectedAnswer)

      // Update or create the answer with grading results
      const existingAnswer = submission.answers.find(
        (a) => a.questionId === answerData.questionId
      )

      if (existingAnswer) {
        await prisma.answer.update({
          where: { id: existingAnswer.id },
          data: {
            answer: answerData.answer,
            score: gradingResult.score,
            isCorrect: gradingResult.isCorrect,
          },
        })
      } else {
        await prisma.answer.create({
          data: {
            answer: answerData.answer,
            score: gradingResult.score,
            isCorrect: gradingResult.isCorrect,
            questionId: answerData.questionId,
            submissionId: submission.id,
          },
        })
      }

      if (gradingResult.score !== null) {
        totalScore += gradingResult.score
      }

      questionResults.push({
        questionId: answerData.questionId,
        answer: answerData.answer,
        score: gradingResult.score,
        isCorrect: gradingResult.isCorrect,
      })
    }

    // Mark submission as submitted and set total score
    const updatedSubmission = await prisma.submission.update({
      where: { id: submission.id },
      data: {
        totalScore,
        submittedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            registrationNumber: true,
            department: true,
            email: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        answers: {
          include: {
            question: {
              select: {
                id: true,
                title: true,
                description: true,
                brokenCode: true,
                expectedAnswer: true,
                timeLimit: true,
              },
            },
          },
        },
      },
    })

    const result: QuizResult = {
      submission: updatedSubmission,
      questionResults,
    }

    res.json(result)
  } catch (error) {
    console.error('Submit quiz error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const submission = await prisma.submission.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            registrationNumber: true,
            department: true,
            email: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        answers: {
          include: {
            question: {
              select: {
                id: true,
                title: true,
                description: true,
                brokenCode: true,
                expectedAnswer: true,
                timeLimit: true,
              },
            },
          },
        },
      },
    })

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    const questionResults = submission.answers.map((answer) => ({
      questionId: answer.questionId,
      answer: answer.answer,
      score: answer.score,
      isCorrect: answer.isCorrect,
    }))

    const result: QuizResult = {
      submission,
      questionResults,
    }

    res.json(result)
  } catch (error) {
    console.error('Get submission error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}