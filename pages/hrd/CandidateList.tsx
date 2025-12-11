import React, { useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useHrdStore } from '../../store/useHrdStore';
import { Candidate } from '../../types';

const CandidateCard: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white shadow-sm rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img 
                src={candidate.user.avatarUrl} 
                alt={candidate.user.name}
                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-grow">
                <h3 className="text-lg font-bold text-black">{candidate.user.name}</h3>
                <p className="text-sm text-black">{candidate.positionApplied}</p>
                <p className="text-sm text-gray-500 mt-1">{candidate.user.email}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {candidate.skills.slice(0, 3).map(skill => (
                        <span key={skill.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            {skill.name}
                        </span>
                    ))}
                    {candidate.skills.length > 3 && (
                         <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            +{candidate.skills.length - 3} lainnya
                        </span>
                    )}
                </div>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                <button 
                    onClick={() => navigate(`/hrd/kandidat/${candidate.id}`)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                    Lihat Detail
                </button>
            </div>
        </div>
    );
};

const CandidateList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const position = searchParams.get('position') || '';
    const { candidates, jobPositions, fetchDashboardStats } = useHrdStore();
    
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

    const filteredCandidates = useMemo(() => {
        if (!position) {
            return candidates;
        }
        return candidates.filter(c => c.positionApplied.toLowerCase() === position.toLowerCase());
    }, [candidates, position]);

    const title = position ? `Kandidat untuk Posisi "${position}"` : "Semua Kandidat";
    const description = position 
        ? `Menampilkan ${filteredCandidates.length} kandidat yang melamar untuk posisi ini.`
        : "Tinjau semua kandidat yang terdaftar dalam sistem.";

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-black">{title}</h1>
                <p className="text-gray-500 mt-1">{description}</p>
            </header>
            
            <div className="mb-6 max-w-sm">
                <label htmlFor="job-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter Berdasarkan Posisi
                </label>
                <select
                    id="job-filter"
                    value={position}
                    onChange={handleFilterChange}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Semua Posisi</option>
                    {jobPositions.map(job => (
                        <option key={job.id} value={job.title}>
                            {job.title}
                        </option>
                    ))}
                </select>
            </div>

            {filteredCandidates.length > 0 ? (
                <div className="space-y-4">
                    {filteredCandidates.map(candidate => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                    ))}
                </div>
            ) : (
                <div className="bg-white shadow-sm rounded-xl p-10 text-center">
                    <h3 className="text-xl font-semibold text-gray-700">Tidak Ada Kandidat</h3>
                    <p className="text-gray-500 mt-2">Tidak ada kandidat yang cocok dengan filter yang diterapkan.</p>
                </div>
            )}
        </div>
    );
};

export default CandidateList;