import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  FileQuestion, Plus, Trash2, Calendar, Clock, Award,
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Eye, Sparkles
} from 'lucide-react';
import { QuestionnaireQuestion } from '../types';

export const TrainerQuestionnaires: React.FC = () => {
  const { questionnaires, addQuestionnaire, deleteQuestionnaire, trainerProfile } = usePlatform();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(trainerProfile.competencies[0] || 'Cloud Computing');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-10-30T23:59');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passingPercentage, setPassingPercentage] = useState(70);

  // Questions in authoring state
  const [questionsList, setQuestionsList] = useState<QuestionnaireQuestion[]>([
    {
      id: 'q_' + Date.now(),
      questionText: 'What is the primary role of an ingress controller in Kubernetes?',
      options: [
        'Route external HTTP/S traffic to internal cluster services',
        'Store container images securely',
        'Manage cluster node OS kernel updates',
        'Provision bare metal server racks'
      ],
      correctOptionIndex: 0,
      explanation: 'Ingress controllers handle reverse proxying and routing of external HTTP/S requests to target pods/services.',
      marks: 5
    }
  ]);

  // Current question authoring sub-form
  const [qText, setQText] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qMarks, setQMarks] = useState(5);

  const handleAddQuestionToQuiz = () => {
    if (!qText.trim() || !opt0.trim() || !opt1.trim()) {
      alert('Please provide the question text and at least 2 options.');
      return;
    }

    const newQuestion: QuestionnaireQuestion = {
      id: 'q_' + Date.now(),
      questionText: qText.trim(),
      options: [opt0.trim(), opt1.trim(), opt2.trim() || 'None of the above', opt3.trim() || 'All of the above'],
      correctOptionIndex: correctIndex,
      explanation: qExplanation.trim() || 'Correct answer verified per curriculum.',
      marks: qMarks
    };

    setQuestionsList(prev => [...prev, newQuestion]);
    setQText('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setQExplanation('');
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestionsList(prev => prev.filter(q => q.id !== id));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || questionsList.length === 0) {
      alert('Please provide a title and at least 1 question.');
      return;
    }

    const totalMarks = questionsList.reduce((acc, q) => acc + q.marks, 0);

    addQuestionnaire({
      title: title.trim(),
      subject,
      trainerId: trainerProfile.id,
      trainerName: trainerProfile.fullName,
      description: description.trim() || 'Mandatory competency evaluation test.',
      deadline,
      durationMinutes,
      passingPercentage,
      totalMarks,
      status: 'Active',
      questions: questionsList
    });

    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  // Filter questionnaires belonging strictly to this trainer
  const myQuestionnaires = questionnaires.filter(
    q => q.trainerId === trainerProfile.id || q.trainerName === trainerProfile.fullName
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase tracking-wider border border-slate-200">
              Staff Portal
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              My Questionnaires & Assessments
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Author and manage timed MCQs with deadlines for your handled courses.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
        >
          <Plus size={15} /> Create Questionnaire
        </button>
      </div>

      {/* Questionnaire List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {myQuestionnaires.map(quiz => (
          <div
            key={quiz.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-purple-200 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 font-bold text-xs rounded-md">
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
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Pass Criteria</span>
                  <span className="text-xs font-bold text-gray-800">{quiz.passingPercentage}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Attempts</span>
                  <span className="text-xs font-bold text-gray-800">{quiz.totalAttempts} taken</span>
                </div>
              </div>

              <div className="text-xs text-gray-400">
                Created on {quiz.createdAt} • Author: {quiz.trainerName}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                Status: {quiz.status}
              </span>

              <button
                onClick={() => {
                  if (confirm(`Delete questionnaire "${quiz.title}"?`)) {
                    deleteQuestionnaire(quiz.id);
                  }
                }}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 p-1.5 transition"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- CREATE QUESTIONNAIRE MODAL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Create Questionnaire with Deadline</h3>
            <p className="text-xs text-gray-500 mb-4">Set time limits, strict deadlines, and MCQ questions</p>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700">Questionnaire Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Distributed Consensus & Raft Protocol Quiz"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full mt-1 p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Curriculum Subject</label>
                  <input
                    required
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full mt-1 p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Overview of topics and preparation advice..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-gray-700">Submission Deadline</label>
                  <input
                    required
                    type="datetime-local"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                    className="w-full mt-1 p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Passing Threshold (%)</label>
                  <input
                    type="number"
                    value={passingPercentage}
                    onChange={e => setPassingPercentage(Number(e.target.value))}
                    className="w-full mt-1 p-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Added Questions List */}
              <div className="pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-800 text-sm block mb-2">
                  Configured Questions ({questionsList.length})
                </span>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {questionsList.map((q, idx) => (
                    <div key={q.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                      <div className="max-w-[80%]">
                        <span className="font-bold text-gray-800">Q{idx + 1}: </span>
                        <span className="text-gray-700">{q.questionText}</span>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          Correct: {q.options[q.correctOptionIndex]} • {q.marks} Marks
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Sub-Builder */}
              <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100 space-y-3">
                <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                  <Sparkles size={14} className="text-purple-600" /> Add Another Question to Questionnaire
                </h4>

                <div>
                  <label className="text-[11px] font-semibold text-gray-700">Question Statement</label>
                  <input
                    type="text"
                    placeholder="Enter multiple choice question..."
                    value={qText}
                    onChange={e => setQText(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700">Option A</label>
                    <input
                      type="text"
                      placeholder="Option A"
                      value={opt0}
                      onChange={e => setOpt0(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700">Option B</label>
                    <input
                      type="text"
                      placeholder="Option B"
                      value={opt1}
                      onChange={e => setOpt1(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700">Option C</label>
                    <input
                      type="text"
                      placeholder="Option C"
                      value={opt2}
                      onChange={e => setOpt2(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700">Option D</label>
                    <input
                      type="text"
                      placeholder="Option D"
                      value={opt3}
                      onChange={e => setOpt3(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700">Select Correct Option</label>
                    <select
                      value={correctIndex}
                      onChange={e => setCorrectIndex(Number(e.target.value))}
                      className="w-full mt-1 p-2 border rounded-lg bg-white font-bold"
                    >
                      <option value={0}>Option A is Correct</option>
                      <option value={1}>Option B is Correct</option>
                      <option value={2}>Option C is Correct</option>
                      <option value={3}>Option D is Correct</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700">Marks for Question</label>
                    <input
                      type="number"
                      value={qMarks}
                      onChange={e => setQMarks(Number(e.target.value))}
                      className="w-full mt-1 p-2 border rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-700">Explanation for Solution</label>
                  <input
                    type="text"
                    placeholder="Why this answer is correct..."
                    value={qExplanation}
                    onChange={e => setQExplanation(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddQuestionToQuiz}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold"
                  >
                    + Append Question
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold"
                >
                  Publish Questionnaire
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
