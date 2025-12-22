
import React, { useEffect, useState } from 'react';
import { useHrdStore } from '../../store/useHrdStore';
import { MatchResult } from '../../types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const MatchingEngine: React.FC = () => {
    const { jobPositions, matchResults, runMatching, loading, fetchDashboardStats } = useHrdStore();
    const [selectedJob, setSelectedJob] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (jobPositions.length === 0) {
            fetchDashboardStats();
        }
    }, [jobPositions, fetchDashboardStats]);

    useEffect(() => {
        if (jobPositions.length > 0 && !selectedJob) {
            setSelectedJob(jobPositions[0].id);
        }
    }, [jobPositions, selectedJob]);
    
    const handleStartMatching = async () => {
        if (!selectedJob) {
            alert("Silakan pilih posisi pekerjaan terlebih dahulu.");
            return;
        }
        setIsProcessing(true);
        await runMatching(selectedJob);
        setIsProcessing(false);
    };
    
    const ResultTable: React.FC<{ results: MatchResult[] }> = ({ results }) => (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Kandidat</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Fit Score</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Ringkasan Kecocokan</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {results.map(({ candidate, fitScore, summary }) => (
                        <tr key={candidate.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img className="h-10 w-10 rounded-full object-cover" src={candidate.user.avatarUrl} alt={candidate.user.name} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-black">{candidate.user.name}</div>
                                        <div className="text-sm text-gray-500">{candidate.user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-black">
                                    {fitScore}%
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-black">{summary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-black">AI Matching Engine</h1>
                <p className="text-gray-500 mt-1">Mulai proses pencocokan kandidat dengan posisi pekerjaan secara otomatis.</p>
            </header>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold text-black mb-6 border-b border-gray-100 pb-2">Konfigurasi</h2>
                <div className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="flex-grow w-full max-w-xs">
                        <label htmlFor="job-position" className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                            Pilih Posisi Pekerjaan
                        </label>
                        <div className="relative">
                            <select
                                id="job-position"
                                value={selectedJob}
                                onChange={(e) => setSelectedJob(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                            >
                                {jobPositions.map(job => (
                                    <option key={job.id} value={job.id}>{job.title}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <ChevronDownIcon className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleStartMatching}
                        disabled={isProcessing || !selectedJob}
                        className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-wait h-[42px] flex items-center justify-center"
                    >
                        {isProcessing ? 'Memproses...' : 'Mulai Pencocokan AI'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <p className="font-semibold text-black">AI sedang memproses data, ini mungkin memakan waktu beberapa saat...</p>
                </div>
            ) : matchResults.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-black mb-6">Hasil Pencocokan</h2>
                    <ResultTable results={matchResults} />
                </div>
            )}
        </div>
    );
};

export default MatchingEngine;
