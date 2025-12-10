import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { Parser } from 'json2csv'

export const exportSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            registrationNumber: true,
            department: true,
            email: true,
          },
        },
        answers: {
          include: {
            question: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    })

    // Transform data for CSV export
    const exportData = []
    for (const submission of submissions) {
      for (const answer of submission.answers) {
        exportData.push({
          id: submission.id,
          fullName: submission.user.fullName,
          registrationNumber: submission.user.registrationNumber,
          department: submission.user.department,
          email: submission.user.email,
          questionId: answer.questionId,
          questionTitle: answer.question.title,
          response: answer.answer,
          score: answer.score,
          totalScore: submission.totalScore,
          submittedAt: submission.submittedAt,
        })
      }
    }

    // Convert to CSV
    const fields = [
      'id',
      'fullName',
      'registrationNumber',
      'department',
      'email',
      'questionId',
      'questionTitle',
      'response',
      'score',
      'totalScore',
      'submittedAt',
    ]

    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(exportData)

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="quiz-submissions-${new Date().toISOString().split('T')[0]}.csv"`)

    res.send(csv)
  } catch (error) {
    console.error('Export submissions error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            registrationNumber: true,
            department: true,
            email: true,
          },
        },
        answers: {
          select: {
            id: true,
            answer: true,
            score: true,
            isCorrect: true,
            question: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    })

    res.json(submissions)
  } catch (error) {
    console.error('Get submissions error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}