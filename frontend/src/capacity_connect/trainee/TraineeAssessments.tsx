import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  FileCheck2, Clock, Calendar, CheckCircle, AlertTriangle,
  Award, ArrowRight, Play, CheckCircle2, XCircle, RotateCcw,
  Sparkles, HelpCircle
} from 'lucide-react';
import { Questionnaire } from '../types';

export const TraineeAssessments: React.FC = () => {
  const { questionnaires, traineeProfile, submitMCQAttempt } = usePlatform();

  const [activeQuiz, setActiveQuiz] = useState<Questionnaire | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const startQuiz = (quiz: Questionnaire) => {
    setActiveQuiz(quiz);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;

    let totalEarned = 0;
    activeQuiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        totalEarned += q.marks;
      }
    });

    const percentage = Math.round((totalEarned / activeQuiz.totalMarks) * 100);
    const passed = percentage >= activeQuiz.passingPercentage;

    setQuizScore(totalEarned);
    setQuizSubmitted(true);

    // Record attempt
    submitMCQAttempt({
      questionnaireId: activeQuiz.id,
      title: activeQuiz.title,
      subject: activeQuiz.subject,
      trainerName: activeQuiz.trainerName,
      score: totalEarned,
      totalMarks: activeQuiz.totalMarks,
      percentage,
      passed,
      timeSpentMinutes: Math.floor(Math.random() * 10) + 12
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Active Quiz View */}
      {activeQuiz ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
            <div>
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md">
                {activeQuiz.subject}
              </span>
              <h2 className="text-xl font-black text-gray-900 mt-1">{activeQuiz.title}</h2>
              <p className="text-xs text-gray-500">By Trainer: {activeQuiz.trainerName}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl text-xs font-bold border border-amber-200">
                <Clock size={14} />
                {activeQuiz.durationMinutes} Mins Allocated
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-xl"
              >
                Close Assessment
              </button>
            </div>
          </div>

          {/* Result Banner if Submitted */}
          {quizSubmitted && (
            <div className={`p-6 rounded-2xl border ${
              (quizScore / activeQuiz.totalMarks) * 100 >= activeQuiz.passingPercentage
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-xs">
                  {(quizScore / activeQuiz.totalMarks) * 100 >= activeQuiz.passingPercentage ? (
                    <Award size={26} className="text-emerald-600" />
                  ) : (
                    <AlertTriangle size={26} className="text-rose-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black">
                    {(quizScore / activeQuiz.totalMarks) * 100 >= activeQuiz.passingPercentage
                      ? 'Congratulations! You Passed!'
                      : 'Assessment Not Cleared'}
                  </h3>
                  <p className="text-xs mt-0.5">
                    Your Score: <span className="font-bold">{quizScore} / {activeQuiz.totalMarks}</span> (
                    {Math.round((quizScore / activeQuiz.totalMarks) * 100)}%) • Passing Requirement:{' '}
                    {activeQuiz.passingPercentage}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-6">
            {activeQuiz.questions.map((q, idx) => {
              const selected = selectedAnswers[q.id];
              const isCorrect = selected === q.correctOptionIndex;

              return (
                <div key={q.id} className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-sm text-gray-900 leading-snug">
                      <span className="text-indigo-600 mr-2">Q{idx + 1}.</span>
                      {q.questionText}
                    </h4>
                    <span className="text-[11px] font-semibold text-gray-400 shrink-0">
                      {q.marks} Marks
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      let optionClasses = 'p-3 rounded-xl border text-xs font-medium cursor-pointer transition text-left flex items-center justify-between ';

                      if (quizSubmitted) {
                        if (optIdx === q.correctOptionIndex) {
                          optionClasses += 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                        } else if (selected === optIdx) {
                          optionClasses += 'bg-rose-100 border-rose-300 text-rose-900 line-through';
                        } else {
                          optionClasses += 'bg-white border-gray-200 text-gray-500';
                        }
                      } else {
                        if (selected === optIdx) {
                          optionClasses += 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold ring-2 ring-indigo-200';
                        } else {
                          optionClasses += 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={optionClasses}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            {opt}
                          </span>

                          {quizSubmitted && optIdx === q.correctOptionIndex && (
                            <CheckCircle2 size={16} className="text-emerald-700" />
                          )}
                          {quizSubmitted && selected === optIdx && optIdx !== q.correctOptionIndex && (
                            <XCircle size={16} className="text-rose-700" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-600 mt-2">
                      <span className="font-bold text-gray-800">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission Bar */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {Object.keys(selectedAnswers).length} of {activeQuiz.questions.length} Questions Answered
            </span>

            {quizSubmitted ? (
              <button
                onClick={() => setActiveQuiz(null)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                Back to Assessments List
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                Submit Answers & View Score
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Questionnaire Directory View */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                  Assessments & MCQs
                </span>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  Available Questionnaires with Deadlines
                </h1>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Take competency tests assigned by trainers before the deadline to earn verified capacity credentials.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-full border border-emerald-100">
              {traineeProfile.mcqsAttempted.length} Assessments Completed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questionnaires.map(quiz => {
              const prevAttempt = traineeProfile.mcqsAttempted.find(
                a => a.questionnaireId === quiz.id
              );

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-emerald-200 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-md">
                        {quiz.subject}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                        <Clock size={13} />
                        Deadline: {quiz.deadline.replace('T', ' ')}
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-gray-900">{quiz.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {quiz.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-2 bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Questions</span>
                        <span className="text-xs font-bold text-gray-800">{quiz.questions.length} MCQs</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Passing %</span>
                        <span className="text-xs font-bold text-gray-800">{quiz.passingPercentage}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Time Limit</span>
                        <span className="text-xs font-bold text-gray-800">{quiz.durationMinutes} mins</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 font-medium">
                      Trainer: <span className="text-gray-700 font-semibold">{quiz.trainerName}</span>
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    {prevAttempt ? (
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          prevAttempt.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          Score: {prevAttempt.score}/{prevAttempt.totalMarks} ({prevAttempt.percentage}%)
                        </span>
                        <button
                          onClick={() => startQuiz(quiz)}
                          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                        >
                          <RotateCcw size={12} /> Re-attempt
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Not attempted yet</span>
                    )}

                    <button
                      onClick={() => startQuiz(quiz)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                      <Play size={13} /> {prevAttempt ? 'Retake MCQ' : 'Start Assessment'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
