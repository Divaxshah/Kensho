
'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('@/components/ui/CodeEditor'), { ssr: false });
const Resizable = dynamic(() => import('re-resizable').then(mod => mod.Resizable), { ssr: false });
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CodingPage() {
    const [topic, setTopic] = useState('Data Structures');
    const [difficulty, setDifficulty] = useState('basic');
    const [numQuestions, setNumQuestions] = useState(1);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [code, setCode] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [tutorChat, setTutorChat] = useState([]);
    const [tutorInput, setTutorInput] = useState('');
    const [showResultsDialog, setShowResultsDialog] = useState(false);

    useEffect(() => {
        console.log("Current Question State:", currentQuestion);
    }, [currentQuestion]);

    const handleGenerateQuestion = async () => {
        setIsLoading(true);
        try {
            const response = await api.generateCodingQuestion(topic || 'random', difficulty, numQuestions);
            console.log("Generated Question Response:", response);
            setGeneratedQuestions(response);
            setCurrentQuestionIndex(0);
            setCurrentQuestion(response[0]);
            setCode(response[0].starting_code || '');
            setResults(null);
            setTutorChat([]);
        } catch (error) {
            console.error('Failed to generate question:', error);
        }
        setIsLoading(false);
    };

    const handleRunCode = async (numTestCases = null) => {
        if (!currentQuestion) return;
        setIsLoading(true);
        try {
            const response = await api.runCode(code, currentQuestion, 'default-session', numTestCases);
            setResults(response.results);
            setShowResultsDialog(true);
        } catch (error) {
            console.error('Failed to run code:', error);
        }
        setIsLoading(false);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < generatedQuestions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setCurrentQuestion(generatedQuestions[nextIndex]);
            setCode(generatedQuestions[nextIndex].starting_code || '');
            setResults(null);
            setTutorChat([]);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            const prevIndex = currentQuestionIndex - 1;
            setCurrentQuestionIndex(prevIndex);
            setCurrentQuestion(generatedQuestions[prevIndex]);
            setCode(generatedQuestions[prevIndex].starting_code || '');
            setResults(null);
            setTutorChat([]);
        }
    };

    const handleTutorChat = async () => {
        if (!currentQuestion || !tutorInput.trim()) return;
        const newChatHistory = [...tutorChat, { role: 'user', content: tutorInput }];
        setTutorChat(newChatHistory);
        setTutorInput('');
        setIsLoading(true);
        try {
            const response = await api.getTutorHelp(code, currentQuestion, newChatHistory, 'default-session');
            setTutorChat([...newChatHistory, { role: 'assistant', content: response.response }]);
        } catch (error) {
            console.error('Failed to get tutor help:', error);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white p-4">
            <Resizable
                defaultSize={{ width: '30%', height: '100%' }}
                minWidth="20%"
                maxWidth="40%"
                enable={{ right: true }}
                className="pr-4 border-r border-gray-700 flex flex-col"
            >
                <div className="flex flex-col h-full">
                    <Card className="mb-4 bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle>Generate a New Question</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <Input
                                placeholder="Topic (e.g., Arrays, Strings)"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="bg-gray-700 border-gray-600"
                            />
                            <Select onValueChange={setDifficulty} defaultValue={difficulty}>
                                <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                                    <SelectValue placeholder="Difficulty" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 text-white">
                                    <SelectItem value="basic">Basic</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(value) => setNumQuestions(Number(value))} defaultValue={numQuestions.toString()}>
                                <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                                    <SelectValue placeholder="Number of Questions" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 text-white">
                                    <SelectItem value="1">1 Question</SelectItem>
                                    <SelectItem value="3">3 Questions</SelectItem>
                                    <SelectItem value="5">5 Questions</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleGenerateQuestion} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 w-full">
                                {isLoading ? 'Generating...' : 'Generate'}
                            </Button>
                        </CardContent>
                    </Card>
                    <div className="flex-grow overflow-y-auto p-4 bg-gray-800 rounded-lg">
                        {currentQuestion ? (
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{currentQuestion.title}</h2>
                                <p className="mb-4">{currentQuestion.description}</p>
                                {currentQuestion.examples && currentQuestion.examples.length > 0 && (
                                    <>
                                        <h3 className="font-semibold">Examples:</h3>
                                        <ul className="list-disc list-inside mb-4">
                                            {currentQuestion.examples.map((ex, i) => (
                                                <li key={i} className="font-mono bg-gray-800 p-2 rounded">
                                                    Input: {JSON.stringify(ex.input)}
                                                    <br />
                                                    Output: {JSON.stringify(ex.output)}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                {currentQuestion.constraints && currentQuestion.constraints.length > 0 && (
                                    <>
                                        <h3 className="font-semibold">Constraints:</h3>
                                        <ul className="list-disc list-inside">
                                            {currentQuestion.constraints.map((con, i) => (
                                                <li key={i}>{con}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        ) : (
                            <p>Generate a question to get started.</p>
                        )}
                        {generatedQuestions.length > 1 && (
                            <div className="flex justify-between mt-4">
                                <Button
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className="bg-gray-600 hover:bg-gray-700"
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-gray-400">
                                    {currentQuestionIndex + 1} / {generatedQuestions.length}
                                </span>
                                <Button
                                    onClick={handleNextQuestion}
                                    disabled={currentQuestionIndex === generatedQuestions.length - 1}
                                    className="bg-gray-600 hover:bg-gray-700"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Resizable>
            <div className="flex flex-col flex-grow pl-4 pr-4">
                <div className="flex-grow">
                    <CodeEditor code={code} onChange={setCode} />
                </div>
                <div className="mt-4 flex justify-end">
                    <Button onClick={() => handleRunCode(1)} disabled={isLoading || !currentQuestion} className="bg-blue-600 hover:bg-blue-700">
                        {isLoading ? 'Running...' : 'Run Test Case'}
                    </Button>
                    <Button onClick={() => handleRunCode()} disabled={isLoading || !currentQuestion} className="bg-green-600 hover:bg-green-700 ml-2">
                        {isLoading ? 'Submitting...' : 'Submit Code'}
                    </Button>
                </div>
            </div>
            <Resizable
                defaultSize={{ width: '30%', height: '100%' }}
                minWidth="20%"
                maxWidth="40%"
                enable={{ left: true }}
                className="pl-4 border-l border-gray-700 flex flex-col"
            >
                <div className="flex-grow flex flex-col">
                    <h3 className="font-semibold mb-2">AI Tutor</h3>
                    <div className="flex-grow overflow-y-auto bg-gray-800 p-4 rounded-t-lg">
                        {tutorChat.map((chat, i) => (
                            <div key={i} className={`mb-2 ${chat.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <span className={`p-2 rounded-lg ${chat.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'} block`}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{chat.content}</ReactMarkdown>
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 p-2 bg-gray-800 rounded-b-lg">
                        <Input
                            placeholder="Ask for a hint..."
                            value={tutorInput}
                            onChange={(e) => setTutorInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleTutorChat()}
                            className="bg-gray-700 border-gray-600"
                        />
                        <Button onClick={handleTutorChat} disabled={isLoading || !currentQuestion} className="bg-green-600 hover:bg-green-700">
                            Send
                        </Button>
                    </div>
                </div>
            </Resizable>
            {showResultsDialog && results && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-3xl h-3/4 flex flex-col">
                        <h3 className="font-semibold text-xl mb-4">Results:</h3>
                        <div className="flex-grow overflow-y-auto pr-2">
                            <ul>
                                {results.map((result, i) => (
                                    <li key={i} className={`p-2 rounded mb-2 ${result.passed ? 'bg-green-800' : 'bg-red-800'}`}>
                                        Test Case {result.test_case}: {result.passed ? 'Passed' : 'Failed'}
                                        {!result.passed && (
                                            <div className="mt-2 p-2 bg-gray-900 rounded">
                                                <p><strong>Output:</strong> {JSON.stringify(result.output)}</p>
                                                <p><strong>Expected:</strong> {JSON.stringify(result.expected)}</p>
                                                {result.error && <p><strong>Error:</strong> {result.error}</p>}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button onClick={() => setShowResultsDialog(false)} className="mt-4 bg-blue-600 hover:bg-blue-700">
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
