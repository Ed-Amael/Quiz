export interface GradingResult {
  score: number | null
  isCorrect: boolean | null
}

export function gradeAnswer(userAnswer: string, expectedAnswer: string): GradingResult {
  // Trim whitespace from both answers
  const trimmedUserAnswer = userAnswer.trim()
  const trimmedExpectedAnswer = expectedAnswer.trim()

  // If either answer is empty, return null for manual review
  if (!trimmedUserAnswer || !trimmedExpectedAnswer) {
    return { score: null, isCorrect: null }
  }

  // Check for exact match (including whitespace)
  if (trimmedUserAnswer === trimmedExpectedAnswer) {
    return { score: 1, isCorrect: true }
  }

  // Normalize both answers by:
  // 1. Removing extra whitespace between tokens
  // 2. Converting to lowercase for case-insensitive comparison
  // 3. Removing semicolons at the end of lines
  const normalizeAnswer = (answer: string): string => {
    return answer
      .split('\n')
      .map(line => line.trim().replace(/;$/, ''))
      .join('\n')
      .replace(/\s+/g, ' ')
      .toLowerCase()
  }

  const normalizedUserAnswer = normalizeAnswer(trimmedUserAnswer)
  const normalizedExpectedAnswer = normalizeAnswer(trimmedExpectedAnswer)

  // Check for normalized match
  if (normalizedUserAnswer === normalizedExpectedAnswer) {
    return { score: 1, isCorrect: true }
  }

  // Check for line-by-line match (ignoring empty lines)
  const userLines = trimmedUserAnswer.split('\n').filter(line => line.trim())
  const expectedLines = trimmedExpectedAnswer.split('\n').filter(line => line.trim())

  if (userLines.length === expectedLines.length) {
    const lineMatches = userLines.every((userLine, index) => {
      const normalizedUserLine = normalizeAnswer(userLine)
      const normalizedExpectedLine = normalizeAnswer(expectedLines[index])
      return normalizedUserLine === normalizedExpectedLine
    })

    if (lineMatches) {
      return { score: 1, isCorrect: true }
    }
  }

  // If no match found, mark for manual review
  return { score: null, isCorrect: null }
}