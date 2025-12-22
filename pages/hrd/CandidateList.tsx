
import React, { useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useHrdStore } from '../../store/useHrdStore';
import { Candidate, RecruitmentStage } from '../../types';
import { EyeIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const STAGE_ORDER = ['Screening', 'Psikotest', 'Interview HR', 'Interview User', 'Penawaran'];

const StageStatusBadge: React.FC<{ 
    stage: RecruitmentStage; 
    candidateId: string;
    jobTitle: string;
    isLocked: boolean;
    onUpdate: (newStatus: RecruitmentStage['status']) => void;
}> = ({ stage, isLocked, onUpdate }) => {
    
    const getBadgeStyles = (status: RecruitmentStage['status']) => {
        switch (status) {
            case 'Lolos': return 'bg-green-100 text-green-700 border-green-200';
            case 'Tidak Lolos': return 'bg-red-100 text-red-700 border-red-200';
            case 'Belum':
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    if (isLocked) {
        return (
            <div className="w-full h-8 flex items-center justify-center bg-gray-50 rounded border border-gray-100 opacity-40 cursor-not-allowed">
                <span className="text-[10px] font-bold text-gray-400">Belum</span>
            </div>
        );
    }

    if (stage.name === 'Screening') {
        return (
            <div className={`w-full h-8 flex items-center justify-center rounded border font-bold text-[10px] ${getBadgeStyles(stage.status)}`}>
                {stage.status}
            </div>
        );
    }

    return (
        <div className="relative">
            <select
                value={stage.status}
                onChange={(e) => onUpdate(e.target.value as RecruitmentStage['status'])}
                className={`w-full h-8 px-1 text-[10px] font-bold rounded border focus:outline-none transition-colors cursor-pointer appearance-none text-center ${getBadgeStyles(stage.status)}`}
            >
                <option value="Belum">⬜ Belum</option>
                <option value="Lolos">🟢 Lolos</option>
                <option value="Tidak Lolos">🔴 Tidak Lolos</option>
            </select>
        </div>
    );
};

const CandidateList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const position = searchParams.get('position') || '';
    const { candidates, jobPositions, fetchDashboardStats, updateStageStatus } = useHrdStore();
    
    useEffect(() => {
        if (jobPositions.length === 0) {
            fetchDashboardStats();
        }
    }, [jobPositions, fetchDashboardStats]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPosition = e.target.value;
        if (newPosition) {
            navigate(`/hrd/kandidat?position=${encodeURIComponent(newPosition)}`);
        } else {
            navigate('/hrd/kandidat');
        }
    };

    const filteredData = useMemo(() => {
        return candidates.filter(c => !position || c.positionApplied.toLowerCase() === position.toLowerCase());
    }, [candidates, position]);

    return (
        <div className="flex flex-col h-full">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-black">
                    {position ? `Manajemen Pelamar: ${position}` : "Manajemen Kandidat"}
                </h1>
                <p className="text-gray-500 mt-1">Kelola status rekrutmen kandidat secara real-time.</p>
            </header>
            
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="max-w-xs w-full">
                    <label htmlFor="job-filter" className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                        Pilih Posisi Pekerjaan
                    </label>
                    <div className="relative">
                        <select
                            id="job-filter"
                            value={position}
                            onChange={handleFilterChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="">Tampilkan Semua</option>
                            {jobPositions.map(job => (
                                <option key={job.id} value={job.title}>{job.title}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <ChevronDownIcon className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Kandidat</th>
                                {!position && <th scope="col" className="px-6 py-4 text-left text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Posisi</th>}
                                {STAGE_ORDER.map(stage => (
                                    <th key={stage} scope="col" className="px-3 py-4 text-center text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-28">
                                        {stage}
                                    </th>
                                ))}
                                <th scope="col" className="px-6 py-4 text-right text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredData.map((cand) => {
                                const activeApp = cand.applicationHistory?.find(a => !position || a.position.toLowerCase() === position.toLowerCase()) || cand.applicationHistory?.[0];
                                
                                return (
                                    <tr key={cand.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm" src={cand.user.avatarUrl} alt="" />
                                                <div className="ml-3">
                                                    <div className="text-sm font-bold text-gray-900">{cand.user.name}</div>
                                                    <div className="text-[10px] text-gray-400">{cand.user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        {!position && (
                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-600">
                                                {cand.positionApplied}
                                            </td>
                                        )}
                                        {STAGE_ORDER.map((stageName, idx) => {
                                            const stageData = activeApp?.stages.find(s => s.name === stageName) || { name: stageName, status: 'Belum' };
                                            
                                            let isLocked = false;
                                            if (idx > 0) {
                                                const prevStageName = STAGE_ORDER[idx - 1];
                                                const prevStageStatus = activeApp?.stages.find(s => s.name === prevStageName)?.status;
                                                if (prevStageStatus !== 'Lolos') {
                                                    isLocked = true;
                                                }
                                            }
                                            const hasFailedBefore = activeApp?.stages.some((s, sIdx) => sIdx < idx && s.status === 'Tidak Lolos');
                                            if (hasFailedBefore) isLocked = true;

                                            return (
                                                <td key={stageName} className="px-2 py-4">
                                                    <StageStatusBadge
                                                        stage={stageData as RecruitmentStage}
                                                        candidateId={cand.id}
                                                        jobTitle={activeApp?.position || cand.positionApplied}
                                                        isLocked={isLocked}
                                                        onUpdate={(status) => updateStageStatus(cand.id, activeApp?.id || 'mock-id', stageName, status)}
                                                    />
                                                </td>
                                            );
                                        })}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button 
                                                onClick={() => navigate(`/hrd/kandidat/${cand.id}`)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CandidateList;
