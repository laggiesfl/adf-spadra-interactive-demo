export function gradeKnowledgeCheck(answerId) {
  return answerId === 'document-owner-date'
    ? { correct: true, messageKey: 'quiz.correct' }
    : { correct: false, messageKey: 'quiz.retry' };
}
