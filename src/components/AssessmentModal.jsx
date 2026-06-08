// src/components/AssessmentModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronRight, AlertTriangle } from 'lucide-react';
import { ASSESSMENTS } from '../data/assessments';

export default function AssessmentModal({ onClose }) {
    const [step, setStep] = useState('selection'); // selection, questions, result
    const [assessmentType, setAssessmentType] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const startAssessment = (type) => {
        setAssessmentType(type);
        setAnswers(new Array(ASSESSMENTS[type].questions.length).fill(null));
        setCurrentQuestionIndex(0);
        setStep('questions');
    };

    const handleAnswer = (score) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = score;
        setAnswers(newAnswers);

        if (currentQuestionIndex < ASSESSMENTS[assessmentType].questions.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 250);
        } else {
            setTimeout(() => setStep('result'), 250);
        }
    };

    const calculateResult = () => {
        const totalScore = answers.reduce((a, b) => a + (b || 0), 0);
        const scoring = ASSESSMENTS[assessmentType].scoring;
        const result = scoring.find(s => totalScore >= s.min && totalScore <= s.max) || scoring[scoring.length - 1];
        return { totalScore, result };
    };

    const renderSelection = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Self-Assessment Check-in</h2>
                <p className="text-slate-500 dark:text-gray-400">
                    These tools can help you understand your feelings, but they are
                    <span className="font-bold text-indigo-500"> NOT a medical diagnosis</span>.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <button
                    onClick={() => startAssessment('gad7')}
                    className="p-6 border border-slate-200 dark:border-gray-800 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 hover:border-indigo-500 transition-all text-left group"
                >
                    <h3 className="text-lg font-bold group-hover:text-indigo-500">Anxiety Check</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">GAD-7 Scale (7 Questions)</p>
                    <p className="text-xs mt-4 text-indigo-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Start <ChevronRight className="w-3 h-3" />
                    </p>
                </button>

                <button
                    onClick={() => startAssessment('phq9')}
                    className="p-6 border border-slate-200 dark:border-gray-800 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 hover:border-indigo-500 transition-all text-left group"
                >
                    <h3 className="text-lg font-bold group-hover:text-indigo-500">Depression Check</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">PHQ-9 Scale (9 Questions)</p>
                    <p className="text-xs mt-4 text-indigo-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Start <ChevronRight className="w-3 h-3" />
                    </p>
                </button>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg flex gap-3 text-amber-700 dark:text-amber-400 text-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>Your responses are private and stored only on this device. If you are in crisis, please contact emergency services or use the SOS button.</p>
            </div>
        </div>
    );

    const renderQuestions = () => {
        const question = ASSESSMENTS[assessmentType].questions[currentQuestionIndex];
        return (
            <div className="max-w-xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                        Question {currentQuestionIndex + 1} of {ASSESSMENTS[assessmentType].questions.length}
                    </h3>
                    <span className="text-xs font-mono bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded">
                        Over the last 2 weeks
                    </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold mb-8 leading-relaxed">
                    "{question}"
                </h2>

                <div className="space-y-3">
                    {[
                        { label: "Not at all", score: 0 },
                        { label: "Several days", score: 1 },
                        { label: "More than half the days", score: 2 },
                        { label: "Nearly every day", score: 3 },
                    ].map((option) => (
                        <button
                            key={option.score}
                            onClick={() => handleAnswer(option.score)}
                            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group
                        ${answers[currentQuestionIndex] === option.score
                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                    : 'border-slate-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <span className="font-medium">{option.label}</span>
                            {answers[currentQuestionIndex] === option.score && <Check className="w-5 h-5" />}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderResult = () => {
        const { totalScore, result } = calculateResult();
        const isHighRisk = totalScore >= 10;

        return (
            <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold">Your Results</h2>

                <div className="py-8">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold mb-4 ${result.bg} ${result.color} border-4 border-white dark:border-gray-900 shadow-xl`}>
                        {totalScore}
                    </div>
                    <h3 className={`text-xl font-bold ${result.color}`}>
                        {result.label}
                    </h3>
                    <p className="text-slate-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                        Based on your responses, you may be experiencing symptoms of {result.label.toLowerCase()}.
                    </p>
                </div>

                {isHighRisk && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl text-left">
                        <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2">Recommended Next Steps</h4>
                        <ul className="space-y-2 text-sm text-indigo-600 dark:text-indigo-400 list-disc list-inside">
                            <li>Consider sharing these results with a counselor or doctor.</li>
                            <li>Check out the "Resources" tab for helpful videos.</li>
                            <li>Try the "Breathing Exercise" to center yourself right now.</li>
                        </ul>
                    </div>
                )}

                <div className="flex gap-4 justify-center pt-4">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-200 dark:bg-gray-800 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-gray-700">Close</button>
                    <button onClick={() => setStep('selection')} className="px-6 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600">Start New</button>
                </div>
            </div>
        )
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-4 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-10">
                        <h1 className="font-bold text-lg text-slate-800 dark:text-gray-200">
                            {step === 'selection' ? 'Health Check-in' : ASSESSMENTS[assessmentType].title}
                        </h1>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="p-6 md:p-8 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step + currentQuestionIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {step === 'selection' && renderSelection()}
                                {step === 'questions' && renderQuestions()}
                                {step === 'result' && renderResult()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
